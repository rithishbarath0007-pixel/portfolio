import GuestbookClientUI from './GuestbookClientUI';

export const metadata = {
  title: 'Contact | Portfolio',
  description: 'Drop a message to collaborate.',
};

export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 min-h-screen flex flex-col justify-center">
      <div className="flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-white mb-6 text-center">
          Send me a <br className="hidden md:block"/> message
        </h1>
        <p className="text-lg text-neutral-400 mb-12 text-center max-w-xl">
          Leave a note or drop a line to collaborate.
        </p>
        
        <GuestbookClientUI />
      </div>
    </main>
  );
}