#!/usr/bin/env node

/**
 * MongoDB Atlas Connection Test Script
 * 
 * This script tests your MongoDB Atlas connection and permissions
 * Run with: node test-mongodb-connection.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testMongoDBConnection() {
  console.log('🔍 Testing MongoDB Atlas Connection...\n');
  
  // Check if MONGODB_URI is configured
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    console.log('💡 Make sure you have MONGODB_URI in your .env.local file');
    return;
  }
  
  console.log('✅ MONGODB_URI found in environment');
  console.log('🔗 Connection string:', uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
  
  let client;
  
  try {
    // Connect to MongoDB
    console.log('\n📡 Connecting to MongoDB Atlas...');
    client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Successfully connected to MongoDB Atlas');
    
    // Get database
    const db = client.db();
    console.log('📊 Database name:', db.databaseName);
    
    // Test 1: List collections (read test)
    console.log('\n🔍 Testing READ permissions...');
    const collections = await db.listCollections().toArray();
    console.log('✅ Read test successful - Found collections:', collections.map(c => c.name));
    
    // Test 2: Write test - try to create a test document
    console.log('\n✏️  Testing WRITE permissions...');
    const testCollection = db.collection('connection_test');
    
    // Try to insert a test document
    const testDoc = {
      _id: 'test-' + Date.now(),
      message: 'Database write test',
      timestamp: new Date()
    };
    
    const insertResult = await testCollection.insertOne(testDoc);
    console.log('✅ Write test (INSERT) successful - ID:', insertResult.insertedId);
    
    // Try to update the test document
    const updateResult = await testCollection.updateOne(
      { _id: testDoc._id },
      { $set: { updated: true, updateTime: new Date() } }
    );
    console.log('✅ Write test (UPDATE) successful - Modified:', updateResult.modifiedCount);
    
    // Try to delete the test document
    const deleteResult = await testCollection.deleteOne({ _id: testDoc._id });
    console.log('✅ Write test (DELETE) successful - Deleted:', deleteResult.deletedCount);
    
    // Test 3: Test the actual news collection
    console.log('\n📰 Testing NEWS collection...');
    const newsCollection = db.collection('news');
    
    // Find a news article
    const article = await newsCollection.findOne({}, { sort: { createdAt: -1 } });
    if (article) {
      console.log('✅ Found article:', article.title);
      console.log('📊 Current views:', article.views || 0);
      
      // Try to increment views
      const originalViews = article.views || 0;
      const incrementResult = await newsCollection.updateOne(
        { _id: article._id },
        { $inc: { views: 1 } }
      );
      
      if (incrementResult.modifiedCount > 0) {
        console.log('✅ View increment successful!');
        
        // Verify the increment worked
        const updatedArticle = await newsCollection.findOne({ _id: article._id });
        console.log('📈 New view count:', updatedArticle.views);
        console.log('🎉 INCREMENT WORKING! Views increased from', originalViews, 'to', updatedArticle.views);
        
        // Reset the view count for testing
        await newsCollection.updateOne(
          { _id: article._id },
          { $set: { views: originalViews } }
        );
        console.log('🔄 Reset view count back to original value');
      } else {
        console.log('❌ View increment failed - no documents modified');
      }
    } else {
      console.log('❌ No articles found in news collection');
    }
    
    console.log('\n🎉 ALL TESTS COMPLETED SUCCESSFULLY!');
    console.log('✅ Your MongoDB Atlas connection has full read/write permissions');
    console.log('💡 The issue might be in your application code or deployment configuration');
    
  } catch (error) {
    console.error('\n❌ MongoDB connection test failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 SOLUTION: Check your MongoDB Atlas database user credentials');
      console.log('   - Verify username and password in MONGODB_URI');
      console.log('   - Ensure the user exists in Database Access');
    }
    
    if (error.message.includes('not authorized')) {
      console.log('\n💡 SOLUTION: Check your MongoDB Atlas database user permissions');
      console.log('   - Go to Database Access → Database Users');
      console.log('   - Edit your user and change permissions to "readWrite"');
      console.log('   - Make sure it applies to the correct database');
    }
    
    if (error.message.includes('IP not in whitelist')) {
      console.log('\n💡 SOLUTION: Check your MongoDB Atlas network access');
      console.log('   - Go to Network Access → IP Access List');
      console.log('   - Add 0.0.0.0/0 to allow all IPs');
      console.log('   - Or add your current IP address');
    }
    
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Disconnected from MongoDB Atlas');
    }
  }
}

// Run the test
testMongoDBConnection().catch(console.error);
