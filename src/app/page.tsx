import Dashboard from '@/components/ui/Dashboard';

function Home() {
  // const [user, setUser] = useState<User | null>(null);

  // useEffect(() => {
  //   // Check for stored user session
  //   const storedUser = localStorage.getItem('user');
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }
  // }, []);

  // const handleLogout = () => {
  //   setUser(null);
  //   localStorage.removeItem('user');
  //   localStorage.removeItem('imageHistory');
  // };

  // if (!user) {
  //   // return <AuthPage onLogin={handleLogin} />;
  //   router.push("/auth")
  // }

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3]">
        <Dashboard
        />
    </div>
  );
}

export default Home;