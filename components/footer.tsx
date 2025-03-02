// Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-4">
        <br/>
        <hr/>
        <br/>
      <div className="container mx-auto text-center">
        <p className="text-gray-600">
          Created with ❤️ in <span className="font-bold">New York City</span>
        </p>
        <p className="text-gray-600">
          by <a href="https://mattlovestech.com" className="text-blue-500 hover:underline">@mattlovestech</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;