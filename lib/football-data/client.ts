import type {
  FootballDataErrorResponse,
  FootballDataHeadToHeadResponse,
  FootballDataMatchesResponse,
  FootballDataTeamsResponse,
} from "@/lib/football-data/types";

const FOOTBALL_DATA_BASE_URL = "https://api.football-data.org/v4";
const REQUEST_TIMEOUT_MS = 20_000;

function getApiKey(): string {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "FOOTBALL_DATA_API_KEY is missing from the environment variables",
    );
  }

  return apiKey;
}

function getErrorMessage(body: unknown): string | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const errorBody = body as FootballDataErrorResponse;

  return typeof errorBody.message === "string"
    ? errorBody.message
    : null;
}

async function footballDataRequest<T>(path: string): Promise<T> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${FOOTBALL_DATA_BASE_URL}${path}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Auth-Token": getApiKey(),
      },
      cache: "no-store",
      signal: controller.signal,
    });

    const responseText = await response.text();

    let responseBody: unknown = null;

    if (responseText) {
      try {
        responseBody = JSON.parse(responseText);
      } catch {
        throw new Error(
          "Football-data.org returned an invalid JSON response",
        );
      }
    }

    if (!response.ok) {
      const apiMessage = getErrorMessage(responseBody);

      throw new Error(
        apiMessage ??
          `Football-data.org request failed with HTTP ${response.status}`,
      );
    }

    if (!responseBody || typeof responseBody !== "object") {
      throw new Error("Football-data.org returned an empty response");
    }

    return responseBody as T;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Football-data.org request timed out");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getCompetitionTeams(
  competitionCode: string,
): Promise<FootballDataTeamsResponse> {
  const normalizedCode = competitionCode.trim().toUpperCase();

  if (!/^[A-Z0-9]+$/.test(normalizedCode)) {
    throw new Error("Invalid football competition code");
  }

  return footballDataRequest<FootballDataTeamsResponse>(
    `/competitions/${encodeURIComponent(normalizedCode)}/teams`,
  );
}

export async function getCompetitionMatches(
  competitionCode: string,
): Promise<FootballDataMatchesResponse> {
  const normalizedCode = competitionCode.trim().toUpperCase();

  if (!/^[A-Z0-9]+$/.test(normalizedCode)) {
    throw new Error("Invalid football competition code");
  }

  return footballDataRequest<FootballDataMatchesResponse>(
    `/competitions/${encodeURIComponent(normalizedCode)}/matches`,
  );
}

export async function getMatchHeadToHead(
  externalMatchId: number,
): Promise<FootballDataHeadToHeadResponse> {
  if (!Number.isInteger(externalMatchId) || externalMatchId <= 0) {
    throw new Error("Invalid football-data.org match ID");
  }

  return footballDataRequest<FootballDataHeadToHeadResponse>(
    `/matches/${externalMatchId}/head2head`,
  );
}
