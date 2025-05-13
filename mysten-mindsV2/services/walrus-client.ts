import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { WalrusClient } from '@mysten/walrus';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

// Setup SuiClient and WalrusClient once (reuse across functions)
const suiClient = new SuiClient({
    url: getFullnodeUrl('testnet'),
});
const walrusClient = new WalrusClient({
    network: 'testnet',
    suiClient,
});

const keypair = new Ed25519Keypair();

// Helper: Store data as a blob
async function storeBlob(data: any) {
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    const { blobId } = await walrusClient.writeBlob({
        blob: encoded,
        deletable: false,
        epochs: 3,
        signer: keypair,
    });
    return blobId;
}

// Helper: Retrieve blob and parse JSON
async function retrieveBlob(blobId: string) {
    const blob = await walrusClient.readBlob({ blobId });
    return JSON.parse(new TextDecoder().decode(blob));
}

// Chat history operations
export async function storeChatHistory(userId: string, conversation: any) {
    try {
        // Store both conversation and metadata together
        const data = {
            type: 'chat_history',
            userId,
            timestamp: Date.now(),
            conversation,
        };
        return await storeBlob(data);
    } catch (error) {
        console.error('Failed to store chat history:', error);
        throw error;
    }
}

export async function retrieveChatHistory(blobId: string) {
    try {
        return await retrieveBlob(blobId);
    } catch (error) {
        console.error('Failed to retrieve chat history:', error);
        throw error;
    }
}

// Educational content operations
export async function storeEducationalContent(content: {
    title: string,
    type: 'article' | 'tutorial' | 'FAQ',
    body: string,
    tags: string[]
}) {
    try {
        const data = {
            ...content,
            type: 'educational_content',
            contentType: content.type,
            tags: content.tags,
            timestamp: Date.now(),
        };
        return await storeBlob(data);
    } catch (error) {
        console.error('Failed to store educational content:', error);
        throw error;
    }
}

// Telegram group info operations
export async function storeTelegramGroupInfo(groupInfo: {
    groupId: string,
    name: string,
    description: string,
    memberCount: number,
    topics: string[]
}) {
    try {
        const data = {
            ...groupInfo,
            type: 'telegram_group',
            topics: groupInfo.topics,
            lastUpdated: Date.now(),
        };
        return await storeBlob(data);
    } catch (error) {
        console.error('Failed to store Telegram group info:', error);
        throw error;
    }
}