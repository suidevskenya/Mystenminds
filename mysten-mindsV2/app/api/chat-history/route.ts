import { NextRequest, NextResponse } from 'next/server';
import { storeChatHistory } from '../../../services/walrus-client';

export async function POST(request: NextRequest) {
    try {
        const { userId, conversation } = await request.json();
        if (!userId || !conversation) {
            return NextResponse.json({ error: 'Missing userId or conversation' }, { status: 400 });
        }
        const blobId = await storeChatHistory(userId, conversation);
        return NextResponse.json({ blobId });
    } catch (error) {
        console.error('Error storing chat history:', error);
        return NextResponse.json({ error: 'Failed to store chat history' }, { status: 500 });
    }
}
