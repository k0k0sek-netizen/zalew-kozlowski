const contentful = require("contentful-management");

async function run() {
    const client = contentful.createClient({
        accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
    });
    const space = await client.getSpace(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID);
    const env = await space.getEnvironment("master");

    const fish = await env.getEntries({ content_type: "fishSpecies" });
    const locale = "pl";

    console.log("=== FISH SPECIES ===");
    const fishMapped = fish.items.map(item => {
        const fields = Object.keys(item.fields).reduce((acc, key) => {
            acc[key] = item.fields[key][locale] || Object.values(item.fields[key])[0];
            return acc;
        }, {});
        return {
            sys: { id: item.sys.id },
            fields: {
                ...fields,
                image: {
                    fields: {
                        file: {
                            url: "//images.unsplash.com/photo-1544551763-46a8723ba3f9" // dummy fallback
                        }
                    }
                }
            }
        };
    });
    console.log(JSON.stringify(fishMapped, null, 2));
}

run().catch(console.error);
