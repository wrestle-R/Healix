import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Star, Gift } from "lucide-react";

const ProfileCompletion = ({ profileData, onCompleteProfile }) => {
  const { percentage, isComplete, suggestions = [] } = profileData;

  const getProgressColor = () => {
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getRewardMessage = () => {
    if (isComplete) {
      return "🎉 Profile Complete! You're ready to attract more patients!";
    }
    if (percentage >= 80) {
      return "🌟 Almost there! Complete your profile to unlock full visibility!";
    }
    if (percentage >= 50) {
      return "⚡ Halfway done! Keep going to boost your professional presence!";
    }
    return "🚀 Let's build your professional profile to attract more patients!";
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {isComplete ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-500" />
          )}
          Profile Completion
          <Badge 
            variant={isComplete ? "default" : "secondary"} 
            className={`ml-auto ${isComplete ? 'bg-green-100 text-green-700' : ''}`}
          >
            {percentage}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={percentage} className="h-3" />
          <p className="text-sm text-center font-medium">
            {profileData.completedFields} of {profileData.totalFields} fields completed
          </p>
        </div>

        {/* Reward/Motivation Message */}
        <div className={`p-3 rounded-lg border-2 border-dashed ${
          isComplete 
            ? 'border-green-300 bg-green-50 text-green-700' 
            : 'border-yellow-300 bg-yellow-50 text-yellow-700'
        }`}>
          <div className="flex items-center gap-2 text-sm font-medium">
            {isComplete ? <Gift className="w-4 h-4" /> : <Star className="w-4 h-4" />}
            {getRewardMessage()}
          </div>
        </div>

        {/* Suggestions */}
        {!isComplete && suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Quick improvements:
            </p>
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${
                  suggestion.priority === 'high' ? 'bg-red-400' : 'bg-yellow-400'
                }`} />
                <span className="flex-1">{suggestion.description}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={onCompleteProfile}
          className="w-full"
          variant={isComplete ? "outline" : "default"}
        >
          {isComplete ? "View Profile" : "Complete Profile"}
        </Button>

        {/* Benefits */}
        {!isComplete && (
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Complete your profile to:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>Appear higher in patient searches</li>
              <li>Build trust with detailed credentials</li>
              <li>Attract more appointment bookings</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCompletion;
