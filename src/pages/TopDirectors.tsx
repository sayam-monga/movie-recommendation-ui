
import Navbar from '@/components/Navbar';
import DirectorCard from '@/components/DirectorCard';
import { mockTopDirectors } from '@/data/mockData';

const TopDirectors = () => {
  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Top Rated Directors</h1>
          
          <div className="space-y-6">
            {mockTopDirectors.map(director => (
              <DirectorCard key={director.id} director={director} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopDirectors;
