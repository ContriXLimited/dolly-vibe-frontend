import { request } from "@/lib/request";

export interface UserVibePass {
  id: string;
  vibeUserId: string;
  vibeProjectId: string;
  userId: string;
  msgCount: number;
  inviteCount: number;
  score: string;
  params: number[]; // Array of numbers [power, speed, skill, defense, magic]
  tags: string[]; // Array of tag strings
  sealedKey: string | null;
  rootHash: string | null;
  tokenId: string | null;
  mintTxHash: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  mintedAt: string | null;
}

export interface MyVibePassesResponse {
  data: {
    message: string;
    data: UserVibePass[];
  };
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface UploadMetadataRequest {
  walletAddress: string;
  nonce: string;
  signature: string;
  tokenMetadata: {
    name: string;
    description: string;
    attributes: any[];
  };
}

export interface UploadMetadataResponse {
  data: {
    message: string;
    data: {
      rootHash: string;
      sealedKey: string;
    };
  };
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface MintINFTRequest {
  walletAddress: string;
  rootHash: string;
  sealedKey?: string; // Optional since it's stored in DB
  nonce: string;
  signature: string;
  tokenMetadata: {
    name: string;
    description: string;
    attributes: any[];
  };
}

export interface MintINFTResponse {
  data: {
    message: string;
    data: UserVibePass;
  };
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface GetMintParamsResponse {
  data: {
    message: string;
    data: {
      contractAddress: string;
      methodName: string;
      params: any[];
      abi: any[];
      to: string;
      data: string;
      metadata: {
        rootHash: string;
        sealedKey: string;
        proof: string;
        dataDescriptions: string[];
      };
    };
  };
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface ConfirmMintRequest {
  txHash: string;
  rootHash: string;
  sealedKey: string;
}

export interface ConfirmMintResponse {
  data: {
    message: string;
    data: UserVibePass;
  };
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface JoinProjectRequest {}

export interface JoinProjectResponse {
  data: {
    message: string;
    data: UserVibePass;
  };
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface GetVibePassByIdResponse {
  data: {
    message: string;
    data: UserVibePass;
  };
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface LeaderboardEntry {
  id: string;
  vibeUserId: string;
  userId: string;
  params: number[];
  tags: string[];
  tokenId: string;
  createdAt: string;
  rank: number;
  score: number;
  yesterdayChange: number;
  userName: string;
}

export interface LeaderboardResponse {
  data: {
    message: string;
    data: LeaderboardEntry[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    timeWindow: string;
    vibeProjectId: string;
  };
  message: string;
  statusCode: number;
  timestamp: string;
}

export class VibePassService {
  // Get user's VibePasses
  static async getMyVibePasses(): Promise<UserVibePass[]> {
    console.log("🌐 API Call: getMyVibePasses", { url: "/vibe-passes/my" });

    try {
      const response = await request<MyVibePassesResponse>({
        method: "GET",
        url: "/vibe-passes/my",
      });

      console.log("📡 API Response:", response.data);
      return response.data.data.data;
    } catch (error: any) {
      console.error("❌ API Error:", error.response?.data || error.message);
      throw error;
    }
  }

  // Upload metadata to 0G Storage
  static async uploadMetadata(
    vibePassId: string,
    data: UploadMetadataRequest
  ): Promise<{rootHash: string, sealedKey: string}> {
    console.log("🌐 API Call: uploadMetadata", {
      vibePassId,
      url: `/vibe-passes/${vibePassId}/upload-metadata`,
    });

    try {
      const response = await request<UploadMetadataResponse>({
        method: "POST",
        url: `/vibe-passes/${vibePassId}/upload-metadata`,
        data,
        timeout: 0, // Remove timeout limit for 0G Storage upload
      });

      console.log("📡 API Response:", response.data);
      // Based on actual response format: response.data.data.data
      return response.data.data.data;
    } catch (error: any) {
      console.error("❌ API Error:", error.response?.data || error.message);
      throw error;
    }
  }

  // Get mint parameters (new frontend mint flow)
  static async getMintParams(
    vibePassId: string,
    walletAddress: string,
    rootHash: string
  ): Promise<{contractAddress: string, methodName: string, params: any[], abi: any[], to: string, data: string, metadata: any}> {
    console.log("🌐 API Call: getMintParams", {
      vibePassId,
      walletAddress,
      rootHash,
      url: `/vibe-passes/${vibePassId}/get-mint-params`,
    });

    try {
      const response = await request<GetMintParamsResponse>({
        method: "GET",
        url: `/vibe-passes/${vibePassId}/get-mint-params`,
        params: {
          walletAddress,
          rootHash
        }
      });

      console.log("📡 API Response:", response.data);
      return response.data.data.data;
    } catch (error: any) {
      console.error("❌ API Error:", error.response?.data || error.message);
      throw error;
    }
  }

  // Confirm mint success (notify server)
  static async confirmMint(
    vibePassId: string,
    data: ConfirmMintRequest
  ): Promise<UserVibePass> {
    console.log("🌐 API Call: confirmMint", {
      vibePassId,
      data,
      url: `/vibe-passes/${vibePassId}/confirm-mint`,
    });

    try {
      const response = await request<ConfirmMintResponse>({
        method: "POST",
        url: `/vibe-passes/${vibePassId}/confirm-mint`,
        data
      });

      console.log("📡 API Response:", response.data);
      return response.data.data.data;
    } catch (error: any) {
      console.error("❌ API Error:", error.response?.data || error.message);
      throw error;
    }
  }

  // Mint INFT (deprecated backend mint flow)
  static async mintINFT(
    vibePassId: string,
    data: MintINFTRequest
  ): Promise<UserVibePass> {
    console.log("🌐 API Call: mintINFT", {
      vibePassId,
      url: `/vibe-passes/${vibePassId}/mint-with-metadata`,
    });

    try {
      const response = await request<MintINFTResponse>({
        method: "POST",
        url: `/vibe-passes/${vibePassId}/mint-with-metadata`,
        data,
        timeout: 0, // Remove timeout limit for blockchain transactions
      });

      console.log("📡 API Response:", response.data);
      return response.data.data.data;
    } catch (error: any) {
      console.error("❌ API Error:", error.response?.data || error.message);
      throw error;
    }
  }

  // Join project
  static async joinProject(data: JoinProjectRequest): Promise<UserVibePass> {
    console.log("🌐 API Call: joinProject", { data, url: "/vibe-passes/join" });

    try {
      const response = await request<JoinProjectResponse>({
        method: "POST",
        url: "/vibe-passes/join",
        data,
      });

      console.log("📡 API Response:", response.data);
      return response.data.data.data;
    } catch (error: any) {
      console.error("❌ API Error:", error.response?.data || error.message);
      throw error;
    }
  }

  // Get VibePass details by ID
  static async getVibePassById(id: string): Promise<UserVibePass> {
    console.log("🌐 API Call: getVibePassById", { id, url: `/vibe-passes/${id}` });

    try {
      const response = await request<GetVibePassByIdResponse>({
        method: "GET",
        url: `/vibe-passes/${id}`,
      });

      console.log("📡 API Response:", response.data);
      return response.data.data.data;
    } catch (error: any) {
      console.error("❌ API Error:", error.response?.data || error.message);
      throw error;
    }
  }

  // Get project leaderboard
  static async getLeaderboard(vibeProjectId: string, timeWindow: string = 'all'): Promise<LeaderboardEntry[]> {
    console.log("🌐 API Call: getLeaderboard", { 
      vibeProjectId, 
      timeWindow,
      url: `/leaderboard/${vibeProjectId}` 
    });

    try {
      const response = await request<LeaderboardResponse>({
        method: "GET",
        url: `/leaderboard/${vibeProjectId}`,
        params: { timeWindow }
      });

      console.log("📡 API Response:", response.data);
      return response.data.data.data;
    } catch (error: any) {
      console.error("❌ API Error:", error.response?.data || error.message);
      throw error;
    }
  }
}
