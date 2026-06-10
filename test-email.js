async function run() {
    const dotenv = require('dotenv');
    dotenv.config({ path: '.env.local' });
    
    const secret = process.env.CONTENTFUL_REVALIDATE_SECRET;
    const url = `http://localhost:3000/api/notify/gallery?secret=${secret}`;
    
    console.log(`Sending POST to ${url}`);
    
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sys: { id: "test-id-123", contentType: { sys: { id: "galleryPhoto" } } },
                fields: {
                    title: { 'pl-PL': 'Testowe Zdjęcie z API' },
                    date: { 'pl-PL': new Date().toISOString() }
                }
            })
        });
        
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", data);
    } catch (e) {
        console.error("Error:", e);
    }
}
run();
