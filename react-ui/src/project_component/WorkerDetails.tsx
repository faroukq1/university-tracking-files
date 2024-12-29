import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { User, Building2, Mail } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const WorkerDetails = () => {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            No worker details available
          </p>
        </CardContent>
      </Card>
    );
  }

  const { firstName, lastName, email, roleDetails } = user;
  const { department, role } = roleDetails;

  return (
    <Card className="w-full mx-auto p-0 rounded-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Worker Profile</CardTitle>
          <Badge variant="secondary" className="text-sm">
            {role}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Personal Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-2 bg-gray-100 rounded-lg">
            <User className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium text-sm">{`${firstName} ${lastName}`}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-2 bg-gray-100 rounded-lg">
            <Mail className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="font-medium text-sm">{email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-2 bg-gray-100 rounded-lg">
            <Building2 className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium text-sm">{department}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkerDetails;
