export const eventCategories = [
  "IRL Events",
  "Hackathons",
  "telegramGroups",
]

export const mockEventsData: Record<string, { title: string; date: string; description: string; location: string; speakers: string; registerAt: string; posterImage: string }[]> = {
  "IRL Events": [
    {
      "title": "Sui Meetup KE",
      "date": "17 May 2025",
      "description": "Organized by Decentrix Africa.",
      "location": "Nafasi Connection, Nairobi.",
      "speakers": "Matu, Moses Timbwa.",
      "registerAt": "https://lu.ma/u720phui",
      "posterImage": "https://i.ibb.co/gbZGjycy/suimeetupkeposter.jpg",
    },
    {
      "title": "Sui Basecamp Dubai",
      "date": "1-2 May 2025",
      "description": "Organized by Mysten Labs in partnership with the Sui Foundation.",
      "location": "Intercontinental Dubai Festival City, Dubai, UAE.",
      "speakers": "Evan Cheng (CEO), Sam Blackshear (CTO), Adeniyi Abiodun (CPO), Kostas Chalkias (Chief Cryptographer), George Danezis (Chief Scientist).",
      "registerAt": "https://sui.io/basecamp",
      "posterImage": "https://i.ibb.co/fGxB76sZ/suibasecamp2025.jpg",
    }
  ],
  "Hackathons": [
    {
      "title": "Sui Overflow",
      "date": "20 May 2025",
      "description": "Organized by Sui Foundation. Location: Virtual (Online).",
      "location": "Virtual (Online)",
      "speakers": "Sui Core Developers & Community Leads.",
      "registerAt": "https://sui.io/overflow",
      "posterImage": "https://i.ibb.co/KjMN1JVP/suioverflowposter.jpg",
    },
    {
      "title": "Sui Buildathon Port-Harcourt",
      "date": "29-31 May 2025",
      "description": "Organized by Sui Foundation.",
      "location": "Port-Harcourt",
      "speakers": "Sui Campus Ambassadors",
      "registerAt": "https://lu.ma/mpip5dcn?tk=DEPhYe",
      "posterImage": "https://i.ibb.co/JjBcXbSm/suibuildathonportharcourtposter.jpg",
    },
  ],
  
}
