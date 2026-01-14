# PodcastIndex MCP Server

A Model Context Protocol (MCP) server for the [PodcastIndex.org](https://podcastindex.org) API. Search podcasts, discover trending shows, find episodes, explore Value4Value monetization, and more.

## Features

- **25+ MCP Tools** covering all major PodcastIndex API endpoints
- **Search** - Find podcasts by term, title, or person (hosts/guests)
- **Podcasts** - Get details by feed ID, URL, iTunes ID, GUID, or browse trending/dead feeds
- **Episodes** - Fetch by feed, episode ID, GUID, or discover live/random episodes
- **Recent** - Get recently updated episodes, feeds, and new feeds
- **Value4Value** - Explore podcast monetization info (no auth required)
- **Stats & Categories** - Current index statistics and category listings
- **Hub Notifications** - PubSubHubbub notifications

## Quick Start

### Get API Credentials (Free)

1. Visit [https://api.podcastindex.org/](https://api.podcastindex.org/)
2. Create a free account
3. Generate your API Key and Secret

### Install for Claude Desktop

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "podcastindex": {
      "command": "npx",
      "args": ["-y", "@podcastindex/mcp-server"],
      "env": {
        "PODCASTINDEX_API_KEY": "your-api-key-here",
        "PODCASTINDEX_API_SECRET": "your-api-secret-here"
      }
    }
  }
}
```

Restart Claude Desktop after adding the configuration.

### Install from Source

```bash
# Clone the repository
git clone https://github.com/cclawton/podcastindex-mcp-server.git
cd podcastindex-mcp-server

# Install dependencies
npm install

# Build
npm run build

# Set environment variables
export PODCASTINDEX_API_KEY="your-api-key"
export PODCASTINDEX_API_SECRET="your-api-secret"

# Run
npm start
```

For Claude Desktop with local installation:

```json
{
  "mcpServers": {
    "podcastindex": {
      "command": "node",
      "args": ["/path/to/podcastindex-mcp-server/dist/index.js"],
      "env": {
        "PODCASTINDEX_API_KEY": "your-api-key-here",
        "PODCASTINDEX_API_SECRET": "your-api-secret-here"
      }
    }
  }
}
```

## Available Tools

### Search Tools
| Tool | Description |
|------|-------------|
| `podcast_search_byterm` | Search podcasts across title, author, owner, and description |
| `podcast_search_bytitle` | Search podcasts by title only |
| `podcast_search_byperson` | Find episodes featuring a specific person |
| `podcast_search_music` | Search for music podcasts |

### Podcast Tools
| Tool | Description |
|------|-------------|
| `podcast_get_byfeedid` | Get podcast by PodcastIndex feed ID |
| `podcast_get_byfeedurl` | Get podcast by feed URL |
| `podcast_get_byitunesid` | Get podcast by iTunes/Apple Podcasts ID |
| `podcast_get_byguid` | Get podcast by GUID |
| `podcast_get_trending` | Get trending podcasts (filter by language/category) |
| `podcast_get_dead` | Get list of dead/inactive podcast feeds |

### Episode Tools
| Tool | Description |
|------|-------------|
| `episodes_get_byfeedid` | Get episodes by podcast feed ID |
| `episodes_get_byfeedurl` | Get episodes by podcast feed URL |
| `episodes_get_byid` | Get a single episode by ID |
| `episodes_get_byguid` | Get episode by GUID |
| `episodes_get_live` | Get currently live streaming episodes |
| `episodes_get_random` | Get random episodes |

### Recent Content Tools
| Tool | Description |
|------|-------------|
| `recent_episodes` | Get recently updated episodes |
| `recent_feeds` | Get recently updated podcast feeds |
| `recent_newfeeds` | Get newly added podcast feeds |

### Value4Value Tools (No Auth Required)
| Tool | Description |
|------|-------------|
| `value_get_byfeedid` | Get Value4Value info by feed ID |
| `value_get_byfeedurl` | Get Value4Value info by feed URL |
| `value_get_bypodcastguid` | Get Value4Value info by podcast GUID |

### Stats & Categories
| Tool | Description |
|------|-------------|
| `stats_current` | Get current PodcastIndex statistics |
| `categories_list` | List all podcast categories |

### Hub Notifications (No Auth Required)
| Tool | Description |
|------|-------------|
| `hub_pubnotify` | Send PubSubHubbub notification |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PODCASTINDEX_API_KEY` | Yes* | Your PodcastIndex API key |
| `PODCASTINDEX_API_SECRET` | Yes* | Your PodcastIndex API secret |
| `PODCASTINDEX_USER_AGENT` | No | Custom user agent (default: "PodcastIndexMCPServer/1.0.0") |

*Required for authenticated endpoints. Value4Value and Hub tools work without credentials.

## Example Usage in Claude

Once configured, you can ask Claude things like:

- "Search for podcasts about AI and machine learning"
- "What are the trending podcasts right now?"
- "Find episodes featuring Joe Rogan"
- "Get the Value4Value information for podcast ID 920666"
- "Show me recently updated podcast feeds"
- "What are all the podcast categories available?"

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch mode for development
npm run dev

# Clean build artifacts
npm run clean
```

## Requirements

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

## License

MIT

## Links

- [PodcastIndex.org](https://podcastindex.org)
- [PodcastIndex API Documentation](https://podcastindex-org.github.io/docs-api/)
- [Get Free API Credentials](https://api.podcastindex.org/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
