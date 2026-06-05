'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecentGames } from '@/modules/games/components/recent-games';

export default function GamesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Game History</h1>
                <p className="text-muted-foreground">
                    Every game you&apos;ve finished against the engine.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Games</CardTitle>
                </CardHeader>
                <CardContent>
                    <RecentGames limit={50} />
                </CardContent>
            </Card>
        </div>
    );
}
