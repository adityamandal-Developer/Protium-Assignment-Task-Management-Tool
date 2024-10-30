import React, { useState, useCallback, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import debounce from "lodash/debounce";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  fetchTasks,
  setFilters,
  selectTasksState,
  updateTask,
} from "@/store/slices/tasksSlice";
import { DateRange } from "react-day-picker";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { fetchUsers } from "@/store/slices/userSlice";
import { Task } from "@/types/types";
import { User } from "next-auth";

type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type Status = "TODO" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";

const priorityColors: Record<Priority, string> = {
  LOW: "bg-gray-500",
  MEDIUM: "bg-blue-500",
  HIGH: "bg-orange-500",
  URGENT: "bg-red-500",
};

const statusColors: Record<Status, string> = {
  TODO: "bg-yellow-500",
  IN_PROGRESS: "bg-blue-500",
  COMPLETED: "bg-green-500",
  ON_HOLD: "bg-gray-500",
};

const TaskTable = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession(); // Get session data
  const { tasks, loading, error, filters } = useAppSelector(selectTasksState);
  const {
    users,
    loading: usersLoading,
    error: usesrError,
  } = useSelector((state: RootState) => state.users);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [updatedTaskData, setUpdatedTaskData] = useState<Partial<Task>>({});
  const [localFilters, setLocalFilters] = useState({
    search: "",
    status: "ALL",
    priority: "ALL",
    dateRange: undefined as DateRange | undefined,
  });

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      dispatch(setFilters({ ...filters, search: value }));
      dispatch(fetchTasks({ filters, token: session?.accessToken || "" }));
    }, 500),
    [filters, dispatch, session?.accessToken]
  );

  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    const apiValue = value === "ALL" ? undefined : value;
    const updatedFilters = { ...filters, [key]: apiValue };
    dispatch(setFilters(updatedFilters));

    if (key === "search") {
      debouncedSearch(value);
    } else {
      dispatch(
        fetchTasks({
          filters: updatedFilters,
          token: session?.accessToken || "",
        })
      );
    }
  };

  const handleDateRangeChange = (dateRange: DateRange | undefined) => {
    setLocalFilters((prev) => ({
      ...prev,
      dateRange,
    }));

    const updatedFilters = {
      ...filters,
      dueDateAfter: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "",
      dueDateBefore: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "",
    };
    dispatch(setFilters(updatedFilters));
    dispatch(
      fetchTasks({ filters: updatedFilters, token: session?.accessToken || "" })
    );
  };

  useEffect(() => {
    if (session?.accessToken) {
      dispatch(fetchTasks({ filters, token: session.accessToken }));
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [dispatch, filters, session?.accessToken, debouncedSearch]);

  /**
   *  @EDIT_TASK
   * */

  const handleEditTask = (task: Task, user?: User) => {
    setSelectedTask(task);
    setUpdatedTaskData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assigneeId: user?.id,
    });
    if (user) {
      handleSaveChanges();
    }
    setDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    console.log("xs");
    if (selectedTask) {
      try {
        await dispatch(
          updateTask({
            taskId: selectedTask.id,
            taskData: updatedTaskData,
            token: session?.accessToken || "",
          })
        ).unwrap();
        setDialogOpen(false);
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  const handleInputChange = (
    field: keyof Partial<Task>,
    value: string | Priority | Status
  ) => {
    setUpdatedTaskData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  /**
   *  @GET_USERS
   * */

  useEffect(() => {
    const token = session?.accessToken ? session?.accessToken : "";
    dispatch(fetchUsers({ token }));
  }, [dispatch]);

  console.log(users);
  const tableContent = (
    <>
      <div className="rounded-md border overflow-y-auto ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} className="">
                <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {task.title}
                </TableCell>
                <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {task.description}
                </TableCell>
                <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
                  <Badge className={`${statusColors[task.status]} text-white`}>
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
                  <Badge
                    className={`${priorityColors[task.priority]} text-white`}
                  >
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {task.dueDate
                    ? format(new Date(task.dueDate), "MMM dd, yyyy")
                    : "No date set"}
                </TableCell>
                <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <DotsHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditTask(task)}>
                        Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          Assign Task
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {users.map((user) => (
                              <DropdownMenuItem
                                key={user.id}
                                onClick={() => handleEditTask(task, user)}
                              >
                                {user.name}
                              </DropdownMenuItem>
                            ))}

                            <DropdownMenuSeparator />
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuItem>Priority</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
            <DialogDescription>
              Make changes to your task here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={updatedTaskData.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={updatedTaskData.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={updatedTaskData.status || ""}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="TODO">TODO</SelectItem>
                    <SelectItem value="IN_PROGRESS">IN PROGRESS</SelectItem>
                    <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                    <SelectItem value="ON_HOLD">ON HOLD</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select
                value={updatedTaskData.priority || ""}
                onValueChange={(value) => handleInputChange("priority", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal"
                    )}
                  >
                    <CalendarIcon />
                    {updatedTaskData.dueDate
                      ? format(new Date(updatedTaskData.dueDate), "PPP")
                      : "Pick a due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    className="col-span-5"
                    mode="single"
                    selected={
                      updatedTaskData.dueDate
                        ? new Date(updatedTaskData.dueDate)
                        : undefined
                    }
                    onSelect={(date) =>
                      handleInputChange(
                        "dueDate",
                        date ? date.toISOString() : Date.now().toString()
                      )
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveChanges}>
              Savee changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

  return (
    <div className="relative min-h-[600px]">
      <Card className="sticky top-0 z-10 bg-background">
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
            <Input
              placeholder="Search tasks..."
              value={localFilters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full"
            />

            <Select
              value={localFilters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="TODO">Todo</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="ON_HOLD">On Hold</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={localFilters.priority}
              onValueChange={(value) => handleFilterChange("priority", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priority</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {localFilters.dateRange?.from ? (
                    localFilters.dateRange.to ? (
                      <>
                        {format(localFilters.dateRange.from, "LLL dd, y")} -{" "}
                        {format(localFilters.dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(localFilters.dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={localFilters.dateRange?.from}
                  selected={localFilters.dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>

        <CardContent>
          {loading && <div className="text-center p-4">Loading...</div>}
          {error && <div className="text-red-500 p-4">{error}</div>}
          {!loading && !error && tableContent}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskTable;
