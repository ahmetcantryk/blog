// Test Supabase connection and data
const { supabase } = require('../src/lib/supabase')

async function testSupabase() {
  console.log('🔍 Testing Supabase connection...')
  
  // Test 1: Environment variables
  console.log('\n📋 Environment Variables:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  console.log('SUPABASE_SERVICE_ROLE_KEY:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
  
  // Test 2: Supabase client
  console.log('\n🔌 Supabase Client:')
  console.log('Client exists:', !!supabase)
  
  if (!supabase) {
    console.error('❌ Supabase client is null!')
    return
  }
  
  // Test 3: Connection test
  console.log('\n🌐 Connection Test:')
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Connection error:', error.message)
    } else {
      console.log('✅ Connection successful!')
      console.log('Total blog count:', data)
    }
  } catch (err) {
    console.error('❌ Connection failed:', err)
  }
  
  // Test 4: Data fetch test
  console.log('\n📊 Data Fetch Test:')
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .limit(5)
    
    if (error) {
      console.error('❌ Data fetch error:', error.message)
    } else {
      console.log('✅ Data fetch successful!')
      console.log('Posts found:', data?.length || 0)
      if (data && data.length > 0) {
        console.log('Sample post:', {
          id: data[0].id,
          title: data[0].title,
          slug: data[0].slug,
          thumbnail: data[0].thumbnail
        })
      }
    }
  } catch (err) {
    console.error('❌ Data fetch failed:', err)
  }
  
  // Test 5: Specific query test
  console.log('\n🎯 Specific Query Test:')
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('publish_date', { ascending: false })
      .range(0, 7)
    
    if (error) {
      console.error('❌ Specific query error:', error.message)
    } else {
      console.log('✅ Specific query successful!')
      console.log('Posts found:', data?.length || 0)
    }
  } catch (err) {
    console.error('❌ Specific query failed:', err)
  }
}

// Run the test
testSupabase().catch(console.error)
