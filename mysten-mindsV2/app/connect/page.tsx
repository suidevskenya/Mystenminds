import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"

export default function ConnectWallet() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Connect Wallet</CardTitle>
            <CardDescription>Connect your Sui wallet to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-between" variant="outline">
              <div className="flex items-center">
                <div className="mr-2 h-5 w-5 rounded-full bg-blue-500" />
                <span>Sui Wallet</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button className="w-full justify-between" variant="outline">
              <div className="flex items-center">
                <div className="mr-2 h-5 w-5 rounded-full bg-purple-500" />
                <span>Ethos Wallet</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button className="w-full justify-between" variant="outline">
              <div className="flex items-center">
                <div className="mr-2 h-5 w-5 rounded-full bg-green-500" />
                <span>Suiet Wallet</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-xs text-muted-foreground text-center">
              By connecting your wallet, you agree to our Terms of Service and Privacy Policy
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
