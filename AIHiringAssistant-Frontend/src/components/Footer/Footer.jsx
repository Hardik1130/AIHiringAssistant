const Footer = () => {
    return (
       <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-gray-200 dark:border-white/10 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 grayscale opacity-50">
              <div className="bg-primary p-1.5 rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">clinical_notes</span>
              </div>
              <span className="font-bold text-sm dark:text-white">AI Hire</span>
            </div>
            <div className="flex gap-8">
              {['Terms', 'Privacy', 'Security', 'Support'].map(link => (
                <a key={link} href="#" className="text-xs font-semibold text-gray-400 hover:text-primary transition-colors">{link}</a>
              ))}
            </div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">© 2026 Devstringx Pvt. Ltd.</p>
          </div>
        </footer>
    );
};

export default Footer;