## Recording Notes
- Set recording resolution and browser webpage to 1280x720
    - The easiest way to set the browser webpage to 1280x720 is to set your desktop resolution to 1280x720 and make the website fullscreen.
- Record video and audio separately. [Here's a tutorial](https://www.youtube.com/watch?v=FF3DhiLY3CY).
- Do a 10s test recording. Make sure you can hear your voice. Make sure your cursor is visible.
- Look at camera
- If you make a mistake, it's best to pick up from at least the last pause. It's easier on the editor.
- Narrate what you're doing
    - e.g. First off I am going to sign up
    - e.g. Now I am going to click on create to create a new post… Let's make the title…
- Send your login creds in the discord in case someone else needs them to get setup. e.g. recreate an account.
- Slides are on [Google Slides](https://docs.google.com/presentation/d/1ZfzuKa0JdkzgOYCuRb36-FvDzTePiTsLNCRX5GWDGsQ/edit?usp=sharing)
- Need a clip of every saying "Hi, I'm [first name] [last name]. Pause. Thank you for watching" for the intro and ending. Only need the webcam, not desktop.

## Intro
### Title Slide
- > Hi I'm Person1, I'm Person2, I'm Person3, I'm Person4, I'm Person 5, [Person1 again] and together we build Forces Unite.

### Purpose Slide
- > Forces Unite is a social platform to help gamers to connect and play together.
- > Unsually to find a match…

### In-Game Matchmaking
- No scheduling
    - can only find games that start now
- Randomized
    - you're thrown into a group of players and play styles that may or may not work together
- Poor customizability
    - can often only pick the game mode you want
- Impersonal

### Chat Platforms
- > Discord for example
- Not scalable
    - When too many people try to setup games, they all start taking over each other and posts get buried in the past.
    - You must already be a member of the discord server or group me group.
- No easy searching
    - must manually text search and scroll through the chat history

### Forums
- > Reddit for example
- Mixed in with other content
    - have to sift through irrelevant and outdated posts
- No easy searching
    - can only text search
- > It's a hassle

### Looking for Teams and Looking for Players Platforms
- Limited to specific games
- Focused on esports
    - can only find people serious about, they aren't here to make friends
- High commitment
    - Must commit to finding teams
    - or must find several players and hope they all want to meet up and are compatible with each other
- Can't schedule events
    - Must hope everyone has similar schedules

### Forces Unite Platform
- Sessions focused
    - Focused on finding and scheduling gaming sessions
    - Lower commitment than joining a team
    - Easier to find the players you're looking for - everyone who joins already knows exactly what their signing up
    - Scheduling when what and how you want to play draws other like-minded players to you.
- Stay connected
    - With integrated chatting and friends capabilities you can stay connected before and after games
    - Chat before and after a session by befriending others
    - Stay connected by chat and friend capabilities
- Endless customizability
    - Searching to quickly find your next session
    - An open ended post creator allows you to play exactly how you want to
- Scheduling - can find or schedule games at the right time for you, whether that be now or next week.
- So now I'm going to hand it over to [name] to talk tech for a minute.

## Tech
### Frontend
- The website is built with React
    - Simple, modern, lots of tutorials
    - Current standard
- Use fantastic MUI component library
    - Gave our app a professional look and feel despite none of us being designers by trade.
    - We picked it because it was free and allowed us to focus less on component design.

### Back End
- We use ASP.NET for the backend framework.
    - Free, open source, and Cross platform
    - Modern and a popular framework choice
    - Backed by Microsoft, has been around as .NET and will be around for awhile
    - Good O/RM library (EF Core)
- SkiaSharp for image conversion and manipulation for avatar uploading
- SignalR for Realtime chat.
- postgres database
    - Free and open source

### Testing
- xUnit for unit tests
- End to end frontend testing with selenium
    - To have a clean slate every run we containerized the app with docker.

### Infrastructure
- We use azure to host everything
    - works well with ASP.NET (both Microsoft). E.g. auto builds and starts dotnet app
    - Good student tier
- Azure's email service for account verification emails.
- Azure Blob storage for avatars.
- Github actions to check linting and testing for problems
- Postgres
    - Free and open source

### Overall
- The tech stack worked out very well we didn't have any major issues. I wouldn't make any changes to it if I could.
- MUI saved time and make our app look professional
- Tight integration of microsoft products made things easier and also saved time
- So now let's walk through a demo of all this in action.

## Demo
### User 1
- Profile
    - Avatar: `Guiseppe-Verdi-in-a-Top-Hat-Giovanni-Boldini-oil-painting.webp`
    - Set description to "I love top hats."
- > Hi I'm [name] and I want to find some people to 3v3 rocket league with this monday.
- > Now I'm really like top hats and I want to start up a new top hat team where we can talk about tophats and play some 3v3 rocket league. So I'm going to create a post to find others with a simmilar interests.
- Goto Create and enter the following information
    - Title: The Gentleman's Riot
    - Game: Rocket League
    - > I'm free monday nights so I'll schedule the first match for then.
    - Start Time: April 22nd, 8pm
    - End Time: April 22nd, 8:30pm
    - Tags: 3v3. Casual. Mic.
    - Description: Must wear a top hat in-game. Must be willing to talk about tophats.
- > Now I already know [name] who always has the gamer tag SteelSpecter1234 likes top hats so I'm going to send an invite to him.
- Search for SteelSpecter1234 in users
- > This look like him
- Click on user.
- Send friend request.
- Send message inviting them: Hey it's [name], join my post here: [URL]
- > Now let's see if he'll join

### User 2
- Username: SteelSpecter1234
- Start logged in on home page
- > Hi I'm [name] and I'm a friend of User 1
- > [name] said he Invited me to play Monday so I just logged on and I see I have a notification here.
- Clicks profile -> Friend requests -> View Profile -> Accepts friend request
- Enters in chat: Will do!
- > Now all we need is one more player

### User 3
- FedoraFanatic365
    - Avatar: `a-gray-tabby-cat-wearing-a-black-fedora-and-a-pair-of-sunglasses-with-a-hat-nearby-cat-as-breaking-bad-character-illustration-generative-ai-photo.jpg`
- Start on discover page
- > Hi I'm [name] and I like fedoras
- > I'm looking for some people to play rocket league with so I'm going to set the game to rocket league
- > Since i'm looking to play now, I'll keep the date as upcoming and I'll sort by the start time
- Looks through posts until finds the right one
- > Here we have a post starting soon. It says only hat people are allowed. This seems like my kind of people.
- Clicks on post
- Looks at Users on sidebar
- > This post already has 2 players so if I join that will complete the team!
- Enters in chat:
    - > Hey guys, let's play some rocket league!
    - > My in-game username is FedoraFanatic365
- > And that's how you use Forces Unite to connect and play with others.
- > Thanks for watching :)
