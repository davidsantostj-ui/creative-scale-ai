// Simple test script to verify the application works
const testUrls = [
  "https://www.aliexpress.com/item/1005004432476491.html",
  "https://shopee.com.br/product/123456789",
  "https://www.shein.com/us/Solid-Print-p-12345.html",
];

async function testApi(url) {
  try {
    console.log(`\n✓ Testing: ${url}`);
    const response = await fetch("http://localhost:3000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ link: url }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log("✓ Success!");
      console.log(`  - Product: ${data.produto.nome}`);
      console.log(`  - Price: ${data.produto.preco}`);
      console.log(`  - Video Prompts: ${data.promptsVideo.length}`);
    } else {
      console.log(`✗ Error: ${data.error}`);
    }
  } catch (error) {
    console.log(`✗ Network error: ${error.message}`);
  }
}

async function runTests() {
  console.log("Testing Creative Scale AI Application\n");
  for (const url of testUrls) {
    await testApi(url);
  }
  console.log("\n✓ Tests completed!");
}

runTests();
