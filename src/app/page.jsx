'use client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SignInButton,SignUpButton } from '@clerk/nextjs';

export default function Home() {
 const { user, isLoaded ,isSignedIn} = useUser();
  const router = useRouter();

  useEffect(() => {
    const registerBackendUser = async () => {
      if (!user || !isLoaded) return;

      try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
        const res = await fetch(`${serverUrl}/api/v1/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clerkUserId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.primaryEmailAddress?.emailAddress,
          }),
        });

        const data = await res.json();
        // console.log('✅ Backend user created:', data);

        // Redirect after backend creation
        router.push('/');
      } catch (err) {
        console.error('❌ Error creating user in backend:', err);
      }
    };

    registerBackendUser();
  }, [user, isLoaded, router]);


  // pseudo data
  const stats = [
    { label: 'Active Ingredients', value: 128 },
    { label: 'Pending Appointments', value: 7 },
    { label: 'Registered Patients', value: 245 },
    { label: 'Recent Ingredient Additions', value: 5 },
  ];

  const recentIngredients = [
    { name: 'Khus Khus', description: 'Enhances fertility and aids in treating insomnia.' },
    { name: 'Rakta Chandan', description: 'Skin-enhancing properties prized in Ayurveda.' },
    { name: 'Swarn Bhashm', description: 'Enhances stamina and strength.' },
  ];
  if (!isSignedIn) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-2">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-green-800 mb-4">Welcome to Admin Dashboard</h2>
          <p className="text-gray-700 mb-6">Please sign in or sign up to access the admin features.</p>
          <div className="flex justify-center gap-4">
            <SignInButton mode='modal'>
              <button className="bg-green-800 text-white font-semibold px-6 py-3 rounded-md hover:bg-green-700 transition">Sign In</button>
            </SignInButton>
            <SignUpButton mode='modal'>
              <button className="bg-green-800 text-white font-semibold px-6 py-3 rounded-md hover:bg-green-700 transition">Sign Up</button>
            </SignUpButton>
          </div>
        </div>
      </div>
    );
  }
  return (
  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl mt-4 font-bold text-green-800 mb-6">Welcome,{user.fullName}!</h1>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <dt className="text-sm font-medium text-gray-500">{stat.label}</dt>
            <dd className="mt-1 text-3xl font-semibold text-green-800">{stat.value}</dd>
          </div>
        ))}
      </div>

      {/* Quick Action Buttons */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-green-800 text-white px-5 py-3 rounded-md shadow hover:bg-green-700 transition" onClick={() => router.push('/ingredients/add_ingredients')}>
            Add New Ingredient
          </button>
          <button className="bg-green-800 text-white px-5 py-3 rounded-md shadow hover:bg-green-700 transition" onClick={() => router.push('/ingredients/ingredients_list')}>
            View Ingredients List
          </button>
          <button className="bg-green-800 text-white px-5 py-3 rounded-md shadow hover:bg-green-700 transition">
            Manage Appointments
          </button>
          <button className="bg-green-800 text-white px-5 py-3 rounded-md shadow hover:bg-green-700 transition">
            Manage Patients
          </button>
        </div>
      </div>

      {/* Recent Ingredients Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Ingredient Additions</h2>
        <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow">
          {recentIngredients.map(({ name, description }) => (
            <li key={name} className="p-4 hover:bg-green-50 cursor-pointer">
              <h3 className="text-lg font-medium text-green-800">{name}</h3>
              <p className="text-gray-600 mt-1 text-sm truncate">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
