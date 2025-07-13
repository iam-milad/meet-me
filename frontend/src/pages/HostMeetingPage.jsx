import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { setCallInitiator, setCallState } from "../store/callSlice";
import * as constants from "../lib/socket/constants";

const lettersOnlyRegex = /^[A-Za-z\s]+$/;

const HostMeetingPage = () => {
  const [name, setName] = useState("");
  const [onlyAudio, setOnlyAudio] = useState(false);
  const [nameError, setNameError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleJoin = () => {
    if (!name.trim()) {
      setNameError("Name is required");
      return;
    }
  
    if (!lettersOnlyRegex.test(name.trim())) {
      setNameError("Name must contain letters only");
      return;
    }
  
    if (name.trim().length > 255) {
      setNameError("Name must not exceed 255 characters");
      return;
    }

    dispatch(setCallInitiator({
      isHost: true,
      participantName: name,
      personalCode: null
    }));

    const callState =  onlyAudio ? constants.callState.CALL_AVAILABLE_ONLY_AUDIO : constants.callState.CALL_AVAILABLE;
    dispatch(setCallState(callState));
  
    setNameError("");
    navigate("/call");
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex justify-center items-center px-6">
      <Card className="w-[450px] md:w-[400px]">
        <CardHeader>
          <CardTitle className="mt-4 text-lg">
            Host a meeting {onlyAudio}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError(""); // clear error while typing
                }}
              />
              {nameError && <p className="text-xs text-red-500 ml-2">{nameError}</p>}
            </div>
            <div className="flex items-center gap-3 my-6">
              <Checkbox
                id="terms"
                className="p-3"
                onCheckedChange={() => setOnlyAudio((prev) => !prev)}
                checked={onlyAudio}
              />
              <Label htmlFor="terms">Only Audio</Label>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button className="w-18" onClick={handleJoin}>
              Join
            </Button>
            <Button variant="outline" className="text-gray-600 w-18" asChild>
              <Link to="/">Cancel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HostMeetingPage;
