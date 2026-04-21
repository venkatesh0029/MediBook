export default function Wireframe() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b-2 border-gray-800 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="border-2 border-gray-800 px-6 py-3">
              <span className="font-mono text-sm font-bold">LOGO</span>
            </div>
            
            {/* Navigation */}
            <nav className="flex gap-8">
              <div className="border-2 border-gray-400 px-4 py-2">
                <span className="font-mono text-xs">Features</span>
              </div>
              <div className="border-2 border-gray-400 px-4 py-2">
                <span className="font-mono text-xs">Pricing</span>
              </div>
              <div className="border-2 border-gray-400 px-4 py-2">
                <span className="font-mono text-xs">About</span>
              </div>
              <div className="border-2 border-gray-800 bg-gray-800 text-white px-4 py-2">
                <span className="font-mono text-xs">Sign In</span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b-2 border-gray-800 bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-12">
            {/* Left - Content */}
            <div className="flex-1 space-y-6">
              {/* Headline */}
              <div className="border-2 border-gray-800 p-4 bg-gray-100">
                <div className="h-8 bg-gray-400 mb-2"></div>
                <div className="h-8 bg-gray-400 w-3/4"></div>
                <span className="font-mono text-xs text-gray-500">H1 Headline</span>
              </div>
              
              {/* Subheadline */}
              <div className="border-2 border-gray-400 p-4">
                <div className="h-4 bg-gray-300 mb-2"></div>
                <div className="h-4 bg-gray-300 mb-2"></div>
                <div className="h-4 bg-gray-300 w-2/3"></div>
                <span className="font-mono text-xs text-gray-500">Description text</span>
              </div>
              
              {/* CTAs */}
              <div className="flex gap-4">
                <div className="border-2 border-gray-800 bg-gray-800 text-white px-8 py-4">
                  <span className="font-mono text-sm">Primary CTA</span>
                </div>
                <div className="border-2 border-gray-800 px-8 py-4">
                  <span className="font-mono text-sm">Secondary CTA</span>
                </div>
              </div>
            </div>
            
            {/* Right - Hero Image */}
            <div className="flex-1">
              <div className="border-2 border-gray-800 aspect-video bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 border-2 border-gray-400 mx-auto mb-4 flex items-center justify-center">
                    <span className="font-mono text-xs">IMG</span>
                  </div>
                  <span className="font-mono text-xs text-gray-500">Hero Image / Illustration</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b-2 border-gray-800 bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Title */}
          <div className="text-center mb-12">
            <div className="border-2 border-gray-800 inline-block p-4 bg-white mb-4">
              <div className="h-6 w-48 bg-gray-400"></div>
              <span className="font-mono text-xs text-gray-500">Section Title</span>
            </div>
          </div>
          
          {/* Feature Grid */}
          <div className="grid grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border-2 border-gray-800 bg-white p-6">
                {/* Icon */}
                <div className="w-16 h-16 border-2 border-gray-400 mb-4 flex items-center justify-center">
                  <span className="font-mono text-xs">ICN</span>
                </div>
                
                {/* Title */}
                <div className="border-2 border-gray-400 p-2 mb-3 bg-gray-100">
                  <div className="h-4 bg-gray-400"></div>
                  <span className="font-mono text-xs text-gray-500">Feature Title</span>
                </div>
                
                {/* Description */}
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300"></div>
                  <div className="h-3 bg-gray-300"></div>
                  <div className="h-3 bg-gray-300 w-4/5"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="border-b-2 border-gray-800 bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Title */}
          <div className="text-center mb-12">
            <div className="border-2 border-gray-800 inline-block p-4 bg-gray-100 mb-4">
              <div className="h-6 w-40 bg-gray-400"></div>
              <span className="font-mono text-xs text-gray-500">Pricing Plans</span>
            </div>
          </div>
          
          {/* Pricing Cards */}
          <div className="grid grid-cols-3 gap-8">
            {['Basic', 'Pro', 'Enterprise'].map((plan, index) => (
              <div 
                key={plan} 
                className={`border-2 p-8 ${
                  index === 1 
                    ? 'border-gray-800 bg-gray-800 text-white scale-105' 
                    : 'border-gray-800 bg-white'
                }`}
              >
                {/* Plan Name */}
                <div className={`border-2 ${index === 1 ? 'border-white' : 'border-gray-400'} p-2 mb-4`}>
                  <span className="font-mono text-sm font-bold">{plan}</span>
                </div>
                
                {/* Price */}
                <div className={`border-2 ${index === 1 ? 'border-white bg-white text-gray-800' : 'border-gray-800 bg-gray-100'} p-4 mb-6`}>
                  <div className="h-10 bg-gray-400 mb-2"></div>
                  <span className="font-mono text-xs text-gray-500">$XX/month</span>
                </div>
                
                {/* Features List */}
                <div className="space-y-3 mb-6">
                  {[1, 2, 3, 4].map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <div className={`w-4 h-4 border-2 ${index === 1 ? 'border-white' : 'border-gray-400'}`}></div>
                      <div className={`h-3 flex-1 ${index === 1 ? 'bg-gray-400' : 'bg-gray-300'}`}></div>
                    </div>
                  ))}
                </div>
                
                {/* CTA Button */}
                <div className={`border-2 ${index === 1 ? 'border-white bg-white text-gray-800' : 'border-gray-800'} p-3 text-center`}>
                  <span className="font-mono text-sm">Select Plan</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-8 mb-8">
            {/* Column 1 - Logo */}
            <div>
              <div className="border-2 border-white px-4 py-2 mb-4 inline-block">
                <span className="font-mono text-xs font-bold">LOGO</span>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-500 w-3/4"></div>
                <div className="h-3 bg-gray-500 w-full"></div>
              </div>
            </div>
            
            {/* Columns 2-4 - Links */}
            {[1, 2, 3].map((col) => (
              <div key={col}>
                <div className="border-2 border-gray-500 px-3 py-2 mb-4 inline-block">
                  <span className="font-mono text-xs">Column {col}</span>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((link) => (
                    <div key={link} className="h-3 bg-gray-500 w-2/3"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t-2 border-gray-500 pt-6">
            <div className="flex justify-between items-center">
              <div className="h-3 bg-gray-500 w-48"></div>
              <div className="flex gap-4">
                {[1, 2, 3].map((social) => (
                  <div key={social} className="w-8 h-8 border-2 border-gray-500"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
