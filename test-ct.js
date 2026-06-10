const contentful = require("contentful-management");

async function run() {
    const client = contentful.createClient({
        accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
    });
    const space = await client.getSpace(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment("master");
    const contentTypes = await environment.getContentTypes();
    
    console.log("ContentTypes in Contentful:");
    contentTypes.items.forEach(ct => {
        console.log(`- ${ct.name} (${ct.sys.id})`);
    });
}
run().catch(console.error);
