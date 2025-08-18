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
  data: UserVibePass;
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
  // 获取用户拥有的VibePasses
  static async getMyVibePasses(): Promise<UserVibePass[]> {
    console.log("🌐 API 调用: getMyVibePasses", { url: "/vibe-passes/my" });

    try {
      const response = await request<MyVibePassesResponse>({
        method: "GET",
        url: "/vibe-passes/my",
      });

      console.log("📡 API 响应:", response.data);
      return response.data.data.data;
    } catch (error: any) {
      console.error("❌ API 错误:", error.response?.data || error.message);
      throw error;
    }
  }

  // 上传元数据到 0G Storage
  static async uploadMetadata(
    vibePassId: string,
    data: UploadMetadataRequest
  ): Promise<{rootHash: string, sealedKey: string}> {
    console.log("🌐 API 调用: uploadMetadata", {
      vibePassId,
      url: `/vibe-passes/${vibePassId}/upload-metadata`,
    });

    try {
      const response = await request<UploadMetadataResponse>({
        method: "POST",
        url: `/vibe-passes/${vibePassId}/upload-metadata`,
        data,
        timeout: 0, // 移除超时限制，因为0G Storage上传可能需要较长时间
      });

      console.log("📡 API 响应:", response.data);
      // 根据实际返回格式：response.data.data.data
      return response.data.data.data;
    } catch (error: any) {
      console.error("❌ API 错误:", error.response?.data || error.message);
      throw error;
    }
  }

  // 获取铸造参数 (新的前端铸造流程)
  static async getMintParams(
    vibePassId: string,
    walletAddress: string,
    rootHash: string
  ): Promise<{contractAddress: string, methodName: string, params: any[], abi: any[], to: string, data: string, metadata: any}> {
    console.log("🌐 API 调用: getMintParams", {
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

      console.log("📡 API 响应:", response.data);
      return response.data.data.data;
    } catch (error: any) {
      console.error("❌ API 错误:", error.response?.data || error.message);
      throw error;
    }
  }

  // 确认铸造成功 (通知服务器)
  static async confirmMint(
    vibePassId: string,
    data: ConfirmMintRequest
  ): Promise<UserVibePass> {
    console.log("🌐 API 调用: confirmMint", {
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

      console.log("📡 API 响应:", response.data);
      return response.data.data.data;
    } catch (error: any) {
      console.error("❌ API 错误:", error.response?.data || error.message);
      throw error;
    }
  }

  // 铸造 INFT (旧的后端铸造流程 - 已弃用)
  static async mintINFT(
    vibePassId: string,
    data: MintINFTRequest
  ): Promise<UserVibePass> {
    console.log("🌐 API 调用: mintINFT", {
      vibePassId,
      url: `/vibe-passes/${vibePassId}/mint-with-metadata`,
    });

    try {
      const response = await request<MintINFTResponse>({
        method: "POST",
        url: `/vibe-passes/${vibePassId}/mint-with-metadata`,
        data,
        timeout: 0, // 移除超时限制，因为区块链交易可能需要较长时间
      });

      console.log("📡 API 响应:", response.data);
      return response.data.data.data;
    } catch (error: any) {
      console.error("❌ API 错误:", error.response?.data || error.message);
      throw error;
    }
  }

  // 加入项目
  static async joinProject(data: JoinProjectRequest): Promise<UserVibePass> {
    console.log("🌐 API 调用: joinProject", { data, url: "/vibe-passes/join" });

    try {
      const response = await request<JoinProjectResponse>({
        method: "POST",
        url: "/vibe-passes/join",
        data,
      });

      console.log("📡 API 响应:", response.data);
      return response.data.data;
    } catch (error: any) {
      console.error("❌ API 错误:", error.response?.data || error.message);
      throw error;
    }
  }

  // 根据ID获取单个VibePass详情
  static async getVibePassById(id: string): Promise<UserVibePass> {
    console.log("🌐 API 调用: getVibePassById", { id, url: `/vibe-passes/${id}` });

    try {
      const response = await request<GetVibePassByIdResponse>({
        method: "GET",
        url: `/vibe-passes/${id}`,
      });

      console.log("📡 API 响应:", response.data);
      return response.data.data.data;
    } catch (error: any) {
      console.error("❌ API 错误:", error.response?.data || error.message);
      throw error;
    }
  }

  // 获取项目排行榜
  static async getLeaderboard(vibeProjectId: string, timeWindow: string = 'all'): Promise<LeaderboardEntry[]> {
    console.log("🌐 API 调用: getLeaderboard", { 
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

      console.log("📡 API 响应:", response.data);
      return response.data.data.data;
    } catch (error: any) {
      console.error("❌ API 错误:", error.response?.data || error.message);
      throw error;
    }
  }
}
