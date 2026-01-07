#!/bin/bash

# William Malone Portfolio Database Setup Script
# This script helps set up the Supabase database

echo "🛡️ William Malone Portfolio Database Setup"
echo "=========================================="

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "database_setup.sql" ]; then
    echo "❌ database_setup.sql not found. Please run this from the project root."
    exit 1
fi

echo "📋 Setup Options:"
echo "1) Run database schema setup only"
echo "2) Run schema + sample data"
echo "3) Run sample data only (if schema already exists)"
echo "4) Connect to Supabase and run interactively"

read -p "Choose option (1-4): " choice

case $choice in
    1)
        echo "🔧 Setting up database schema..."
        supabase db reset
        supabase db push
        echo "✅ Schema setup complete!"
        ;;
    2)
        echo "🔧 Setting up database schema and sample data..."
        supabase db reset
        supabase db push
        echo "📝 Inserting sample data..."
        supabase db reset --seed
        echo "✅ Complete setup finished!"
        ;;
    3)
        echo "📝 Inserting sample data only..."
        # This would require manual execution or using supabase client
        echo "⚠️  Please run the seed_data.sql manually in your Supabase dashboard"
        echo "📊 Supabase Dashboard: https://app.supabase.com"
        ;;
    4)
        echo "🔗 Opening Supabase dashboard..."
        echo "📊 Please run the SQL files manually in the SQL editor"
        echo "🌐 Dashboard: https://app.supabase.com"
        open "https://app.supabase.com"
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🎯 Next Steps:"
echo "1. Update your .env files with Supabase credentials"
echo "2. Start the backend server: cd packages/backend && npm run dev"
echo "3. Start the frontend: cd packages/frontend && npm run dev"
echo "4. Start the admin panel: cd packages/admin && npm run dev"
echo ""
echo "📚 Important Notes:"
echo "- Admin email: william.malone80@gmail.com"
echo "- All content is database-driven"
echo "- RLS policies ensure security"
echo "- Sample data provided for testing"
echo ""
echo "🚀 Your portfolio will be ready at: http://localhost:3000"
