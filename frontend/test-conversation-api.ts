// Debug helper - Add this to your ChatInterface temporarily to test

// Test function to verify API connectivity
export async function testConversationAPI() {
    console.log("🧪 Testing Conversation API...");

    try {
        // Test 1: Get conversations
        console.log("Test 1: Fetching conversations...");
        const { getConversations } = await import("@/services/api");
        const convs = await getConversations();
        console.log("✅ Get conversations works:", convs);

        // Test 2: Create conversation
        console.log("Test 2: Creating test conversation...");
        const { createConversation } = await import("@/services/api");
        const testConv = await createConversation("Test Conversation", [
            { role: "user", content: "Hello", timestamp: new Date() },
            { role: "ai", content: "Hi there!", timestamp: new Date() }
        ]);
        console.log("✅ Create conversation works:", testConv);

        // Test 3: Get the created conversation
        console.log("Test 3: Fetching created conversation...");
        const { getConversation } = await import("@/services/api");
        const retrieved = await getConversation(testConv._id);
        console.log("✅ Get conversation works:", retrieved);

        // Test 4: Update conversation
        console.log("Test 4: Updating conversation...");
        const { updateConversation } = await import("@/services/api");
        const updated = await updateConversation(testConv._id, [
            { role: "user", content: "Hello", timestamp: new Date() },
            { role: "ai", content: "Hi there!", timestamp: new Date() },
            { role: "user", content: "How are you?", timestamp: new Date() },
            { role: "ai", content: "I'm good!", timestamp: new Date() }
        ]);
        console.log("✅ Update conversation works:", updated);

        // Test 5: Delete conversation
        console.log("Test 5: Deleting test conversation...");
        const { deleteConversation } = await import("@/services/api");
        await deleteConversation(testConv._id);
        console.log("✅ Delete conversation works");

        console.log("🎉 All API tests passed!");
        return true;
    } catch (error) {
        console.error("❌ API Test failed:", error);
        return false;
    }
}

// Add this to your browser console and run:
// testConversationAPI()
