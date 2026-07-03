function Register() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">AI <span className="text-blue-500">BI</span> Platform</h1>
          <p className="text-zinc-400 mt-2 text-sm">Natural Language Business Intelligence</p>
        </div>

        {/* Card */}
        <div className="bg-black border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Create your account</h2>

          <div className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Organization */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Organization Name</label>
              <input
                type="text"
                placeholder="Acme Corp"
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Button */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors">
              Create Account
            </button>

          </div>

          <p className="text-center text-zinc-500 text-sm mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-blue-400 hover:underline">Sign in</a>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Register