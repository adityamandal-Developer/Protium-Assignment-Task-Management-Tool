// @ts-nocheck
"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { fetchTasks, selectTasksState } from "@/store/slices/tasksSlice";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { createComment } from "@/store/slices/commentsSlice";

const TaskComments: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const { loading, error, filters } = useAppSelector(selectTasksState);
  const [localTasks, setLocalTasks] = useState([]);

  // Fetch tasks initially and set local state
  useEffect(() => {
    if (session?.accessToken) {
      dispatch(fetchTasks({ filters, token: session.accessToken }))
        .then((result) => {
          if (result.payload) {
            setLocalTasks(result.payload);
          }
        })
        .catch((err) => console.error("Error fetching tasks:", err));
    }
  }, [dispatch, session?.accessToken, filters]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleSubmit = async (e: React.FormEvent, taskId: string) => {
    e.preventDefault();
    if (session?.accessToken && taskId && content) {
      try {
        const newComment = await dispatch(
          createComment({ taskId, content, token: session?.accessToken })
        ).unwrap(); // Unwrap to get the payload
        setContent("");

        // Update the specific task's comments in local state
        setLocalTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId
              ? { ...task, comments: [...task.comments, newComment] }
              : task
          )
        );
      } catch (error) {
        console.error("Failed to create comment:", error);
      }
    }
  };

  return (
    <ScrollArea className="rounded-md border col-span-3 max-h-[590px] p-4">
      <CardTitle className="p-2">Conversations</CardTitle>
      {localTasks.map((task) => (
        <Card key={task.id} className="w-full p-4 rounded-md mb-4 p-2">
          <CardHeader>
            <CardTitle className="font-normal">
              by {task.creator.name} due{" "}
              {new Date(task.dueDate).toLocaleDateString()}
            </CardTitle>
            <CardDescription>
              {task.title}
              <br />
              {task.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="ml-10 mr-2 rounded-xl border bg-card text-card-foreground shadow">
            {task.comments.length > 0 ? (
              task.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="mt-4 border rounded-sm p-2 flex flex-col justify-start items-start"
                >
                  <div>
                    <p className="font-medium">{comment.user.name} commented</p>
                    <p>{comment.content}</p>
                    <p className="text-sm">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No conversations</p>
            )}
          </CardContent>
          <form
            onSubmit={(e) => handleSubmit(e, task.id)}
            className="flex flex-col mt-2 ml-[24%] w-[75%] justify-center items-end gap-2"
          >
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message here."
              className=""
            />
            <Button type="submit" className="w-[60%] sm:w-[40%]">
              Send message
            </Button>
          </form>
        </Card>
      ))}
    </ScrollArea>
  );
};

export default TaskComments;
