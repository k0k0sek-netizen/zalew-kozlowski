const contentful = require("contentful-management");

async function run() {
    const client = contentful.createClient({
        accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
    });
    const space = await client.getSpace(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment("master");
    const entries = await environment.getEntries({ content_type: "infoBlock" });
    
    console.log("infoBlock Entries in Contentful:");
    entries.items.forEach(e => {
        const fields = Object.keys(e.fields).reduce((acc, key) => {
            acc[key] = Object.values(e.fields[key])[0];
            return acc;
        }, {});
        console.log(`- ${fields.title} (id: ${fields.id})`);
    });
}
run().catch(console.error);
