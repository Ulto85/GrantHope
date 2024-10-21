## [Devpost Link](https://devpost.com/software/granthope)

## Inspiration

Rare disease nonprofits face a unique challenge - they need funding to support their vital missions, but often lack the resources to effectively search for grants. Through interactions advocacy groups, we witnessed firsthand how organizations spend countless hours manually searching for funding opportunities. This inspired us to create GrantHope, a platform that automates grant discovery and matching, allowing these organizations to focus on what truly matters - supporting their communities and advancing research.

## What it does

GrantHope transforms the grant search process for rare disease nonprofits through intelligent automation. Organizations create detailed profiles about their mission, focus area, and needs. Our AI then continuously scans and analyzes grant opportunities, matching them based on relevance and requirements. The platform provides real-time updates on deadlines, validates eligibility criteria, and helps organizations prioritize the most promising opportunities. This streamlined approach turns what was once a time-consuming manual process into an efficient, automated workflow.

## How we built it

Our platform combines advanced AI capabilities with a microservices architecture to deliver efficient and scalable grant matching. We built the frontend using Next.js 14 with shadcn/ui components for a modern, responsive interface. The backend utilizes Python-based microservices with Fetch AI's uAgents, integrating Google Gemini for intelligent matching and Tavily API for comprehensive grant searches. This tech stack enables us to process complex grant requirements and match them with organization profiles accurately. The Agent workflow is split into three parts. First a prompt planner generates search queries that cover a wide variety of grants (broad:"rare device funding"  all the way to specific: "VHL research grants"). This is then given to a Searcher Agent which finds links to all grants matching the search queries. Lastly a validation agent looks through each link, extracts a broad overview of the grant opportunity, the approximate funding range, and. the deadline. It also sees if the grant matches the NGO's mission so only highly relevant grants are shown to the user.

Here are our agents on AgentVerse:

Searcher Agent: https://agentverse.ai/agents/details/agent1qfdclr87pf02w5g7nc4l6yprperm8cyguvwl3d7mydq9jm6gsduj7px0p7x/profile

Prompt Planner Agent: https://agentverse.ai/agents/details/agent1qtafwqfdzzsh5t5vddnc7n9vz4d59dktpg7rlgvxk5lslpd2yqq76zpzu7f/profile

Web Page Validation/Extraction Agent: https://agentverse.ai/agents/details/agent1qgkkgvqxkfe5s3dpkmz0jsxw2ac7t4g8c93mzpad8xate5n64fu7j03h5lv/profile


## Challenges we ran into

During development, we encountered several significant hurdles. Initially, we started with Reflex for our frontend but realized it didn't provide the performance and flexibility we needed, leading to a complete pivot to Next.js. Adapting our uAgents microservices to work as REST APIs proved challenging, requiring careful consideration of state management and API design. We also faced interesting technical challenges in balancing the precision of our AI matching algorithm with the need to cast a wide enough net for grant opportunities. Rate limits across multiple APIs forced us to implement clever caching and request management strategies.

## Accomplishments that we're proud of

Our greatest achievement lies in creating a platform that genuinely simplifies the grant discovery process for rare disease nonprofits. We successfully implemented an intelligent matching system that adapts to each organization's unique profile while maintaining high accuracy. The clean, intuitive interface masks the complex technology underneath, making it accessible to users regardless of their technical expertise. Our microservices architecture ensures the platform can scale as we add more features and support more organizations.

## What we learned

This project provided invaluable insights into both technical and domain-specific challenges. We deepened our understanding of Next.js architecture and React state management while mastering the intricacies of AI prompt engineering for specific contexts. The process of building microservices taught us important lessons about system design and API integration. Perhaps most importantly, we gained a deeper appreciation for the challenges faced by rare disease nonprofits and the impact technology can have in supporting their missions.

## What's next for GrantHope

Looking ahead, we envision GrantHope evolving into a comprehensive grant management platform. We plan to implement features for tracking grant applications through their lifecycle, facilitating collaboration between organizations, and providing automated progress tracking. Machine learning will continue to improve our matching algorithms based on user feedback and application outcomes. We're also exploring integrations with grant submission portals to streamline the application process further by autofilling these applications. Our ultimate goal is to create an end-to-end solution that empowers rare disease nonprofits to secure the funding they need to make a difference in their communities. However we would also like to look into further streamlining other aspects of a nonprofit's lifecycle, including their budgets, legal work, and much more
