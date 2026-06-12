"use client"
import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card.jsx";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Textarea } from "@/builder/components/ui/Textarea.jsx";
import { Button } from "../../ui/Button.jsx";
import { Input } from "../../ui/Input.jsx";
import { Label } from "../../ui/Label.jsx";

export function AchivementForm({ data = [], onUpdate = () => {} }) {
  // Add a new achievement
  const addAchievement = () => {
    const newAchievement = {
      id: Date.now().toString(),
      title: "",
      description: "",
    };
    onUpdate([...data, newAchievement]);
  };

  // Remove an achievement
  const removeAchievement = (id) => {
    onUpdate(data.filter((item) => item.id !== id));
  };

  // Update a field in an achievement
  const updateAchievement = (id, field, value) => {
    onUpdate(
      data.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Empty state */}
      {data.length === 0 && (
        <Card className="bg-muted/30 shadow-md dark:bg-gray-800">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              No achievements added yet
            </p>
            <Button
              onClick={addAchievement}
              className="bg-purple-600 dark:bg-purple-800 text-white hover:bg-purple-500 dark:hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your Achievement
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Render each achievement */}
      {data.map((achievement, index) => (
        <Card
          key={achievement.id}
          className="bg-muted/30 dark:bg-gray-900 shadow-md rounded-2xl"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GripVertical className="h-4 w-4 dark:text-gray-400" />
                <CardTitle className="text-base dark:text-gray-100">
                  Achievement #{index + 1}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeAchievement(achievement.id)}
                className="text-gray-800 dark:text-gray-200"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Title *</Label>
              <Input
                value={achievement.title}
                onChange={(e) =>
                  updateAchievement(achievement.id, "title", e.target.value)
                }
                placeholder="Achievement title"
                required
                className="bg-[#fefaf5] dark:bg-gray-800 text-gray-800 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Description</Label>
              <Textarea
                value={achievement.description}
                onChange={(e) =>
                  updateAchievement(achievement.id, "description", e.target.value)
                }
                placeholder="Description of achievement"
                className="bg-[#fefaf5] dark:bg-gray-800 text-gray-800 dark:text-gray-100"
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Add another button */}
      {data.length > 0 && (
        <Button
          onClick={addAchievement}
          variant="outline"
          className="w-full bg-transparent text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 hover:text-white bg-purple-700 text-white hover:bg-purple-500 dark:bg-purple-800 dark:hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Achievement
        </Button>
      )}
    </div>
  );
}

AchivementForm.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string,
      description: PropTypes.string,
    })
  ),
  onUpdate: PropTypes.func,
};