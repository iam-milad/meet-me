import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <div className="w-full h-screen bg-gray-100 flex justify-center items-center">
      <Card className="w-[450px] md:w-[600px] px-16 py-20">
        <CardHeader>
          <div className="flex items-center justify-center h-full w-full">
            <img className="w-[200px] md:w-[300px]" src="images/logo.png"></img>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5 w-[180px] mx-auto mt-9">
            <Button asChild>
              <Link to="/join-meeting">Join a meeting</Link>
            </Button>
            <Button variant="outline" className="text-gray-600" asChild>
              <Link to="/host-meeting">Host a meeting</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
