"use client";

import * as React from "react";
import { Moon, Sun, Check, X, Bell, Mail, Settings, User, Search, ChevronRight, Plus, Minus, Heart, Star, Trash2, Edit, Copy, MoreHorizontal, ArrowRight, Loader2, AlertCircle, Info, CheckCircle2, XCircle } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setIsDark(!isDark)}
      className="fixed top-20 right-4 z-50"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

function Section({ id, title, description, children }: { id?: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function ComponentCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
}

export default function DesignSystemPage() {
  const [sliderValue, setSliderValue] = React.useState([50]);
  const [progress, setProgress] = React.useState(60);

  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />

      {/* Hero */}
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Design System</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive showcase of all UI components with their variations. Toggle dark mode to preview both themes.
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-2 mb-16">
          {["Buttons", "Forms", "Data Display", "Feedback", "Overlays", "Navigation", "Layout"].map((category) => (
            <a
              key={category}
              href={`#${category.toLowerCase().replace(" ", "-")}`}
              className="px-4 py-2 rounded-full text-sm font-medium bg-muted hover:bg-muted/80 transition-colors"
            >
              {category}
            </a>
          ))}
        </nav>

        <div className="space-y-24">
          {/* Buttons Section */}
          <Section id="buttons" title="Buttons" description="Interactive button components with various styles and sizes.">
            <div className="grid gap-6 md:grid-cols-2">
              <ComponentCard title="Button Variants">
                <div className="flex flex-wrap gap-3">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </ComponentCard>

              <ComponentCard title="Button Sizes">
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon"><Plus className="h-4 w-4" /></Button>
                </div>
              </ComponentCard>

              <ComponentCard title="Button States">
                <div className="flex flex-wrap gap-3">
                  <Button>Normal</Button>
                  <Button disabled>Disabled</Button>
                  <Button disabled>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading
                  </Button>
                </div>
              </ComponentCard>

              <ComponentCard title="Button with Icons">
                <div className="flex flex-wrap gap-3">
                  <Button><Mail className="h-4 w-4" /> Login with Email</Button>
                  <Button variant="outline"><Settings className="h-4 w-4" /> Settings</Button>
                  <Button variant="secondary">Next <ArrowRight className="h-4 w-4" /></Button>
                </div>
              </ComponentCard>
            </div>
          </Section>

          {/* Forms Section */}
          <Section id="forms" title="Forms" description="Form components for user input and data collection.">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <ComponentCard title="Text Input">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="disabled">Disabled</Label>
                    <Input id="disabled" disabled placeholder="Disabled input" />
                  </div>
                </div>
              </ComponentCard>

              <ComponentCard title="Textarea">
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Type your message here..." />
                </div>
              </ComponentCard>

              <ComponentCard title="Select">
                <div className="space-y-2">
                  <Label>Choose an option</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </ComponentCard>

              <ComponentCard title="Checkbox">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">Accept terms and conditions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="checked" defaultChecked />
                    <Label htmlFor="checked">Already checked</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="disabled-check" disabled />
                    <Label htmlFor="disabled-check" className="text-muted-foreground">Disabled</Label>
                  </div>
                </div>
              </ComponentCard>

              <ComponentCard title="Switch">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Notifications</Label>
                    <Switch id="notifications" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="marketing">Marketing emails</Label>
                    <Switch id="marketing" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="disabled-switch" className="text-muted-foreground">Disabled</Label>
                    <Switch id="disabled-switch" disabled />
                  </div>
                </div>
              </ComponentCard>

              <ComponentCard title="Radio Group">
                <RadioGroup defaultValue="option-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-1" id="r1" />
                    <Label htmlFor="r1">Option 1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-2" id="r2" />
                    <Label htmlFor="r2">Option 2</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-3" id="r3" />
                    <Label htmlFor="r3">Option 3</Label>
                  </div>
                </RadioGroup>
              </ComponentCard>

              <ComponentCard title="Slider">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Volume</Label>
                      <span className="text-sm text-muted-foreground">{sliderValue[0]}%</span>
                    </div>
                    <Slider
                      value={sliderValue}
                      onValueChange={setSliderValue}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>
              </ComponentCard>

              <ComponentCard title="Toggle">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Toggle aria-label="Toggle bold">
                      <span className="font-bold">B</span>
                    </Toggle>
                    <Toggle aria-label="Toggle italic">
                      <span className="italic">I</span>
                    </Toggle>
                    <Toggle aria-label="Toggle underline">
                      <span className="underline">U</span>
                    </Toggle>
                  </div>
                  <ToggleGroup type="single" defaultValue="center">
                    <ToggleGroupItem value="left">Left</ToggleGroupItem>
                    <ToggleGroupItem value="center">Center</ToggleGroupItem>
                    <ToggleGroupItem value="right">Right</ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </ComponentCard>
            </div>
          </Section>

          {/* Data Display Section */}
          <Section id="data-display" title="Data Display" description="Components for presenting information and data.">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <ComponentCard title="Badge">
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </ComponentCard>

              <ComponentCard title="Avatar">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">AB</AvatarFallback>
                  </Avatar>
                </div>
              </ComponentCard>

              <ComponentCard title="Progress">
                <div className="space-y-4">
                  <Progress value={progress} />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setProgress(Math.max(0, progress - 10))}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setProgress(Math.min(100, progress + 10))}>
                      <Plus className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground ml-auto">{progress}%</span>
                  </div>
                </div>
              </ComponentCard>

              <ComponentCard title="Skeleton">
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                </div>
              </ComponentCard>

              <ComponentCard title="Separator">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span>Item 1</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span>Item 2</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span>Item 3</span>
                  </div>
                  <Separator />
                  <p className="text-sm text-muted-foreground">Content below separator</p>
                </div>
              </ComponentCard>
            </div>

            {/* Table */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Table</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: "John Doe", status: "Active", role: "Admin" },
                      { name: "Jane Smith", status: "Inactive", role: "User" },
                      { name: "Bob Johnson", status: "Active", role: "Editor" },
                    ].map((user) => (
                      <TableRow key={user.name}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Section>

          {/* Feedback Section */}
          <Section id="feedback" title="Feedback" description="Components for providing feedback and notifications.">
            <div className="grid gap-6 md:grid-cols-2">
              <ComponentCard title="Alert">
                <div className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Information</AlertTitle>
                    <AlertDescription>This is an informational alert message.</AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>Something went wrong. Please try again.</AlertDescription>
                  </Alert>
                </div>
              </ComponentCard>

              <ComponentCard title="Tooltip">
                <div className="flex gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add to favorites</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Star className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Rate this item</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy to clipboard</TooltipContent>
                  </Tooltip>
                </div>
              </ComponentCard>
            </div>
          </Section>

          {/* Overlays Section */}
          <Section id="overlays" title="Overlays" description="Modal dialogs, popovers, and dropdown menus.">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <ComponentCard title="Dialog">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Dialog Title</DialogTitle>
                      <DialogDescription>
                        This is a dialog description. You can put any content here.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground">Dialog content goes here...</p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button>Continue</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </ComponentCard>

              <ComponentCard title="Dropdown Menu">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Open Menu <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="h-4 w-4 mr-2" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell className="h-4 w-4 mr-2" /> Notifications
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </ComponentCard>

              <ComponentCard title="Popover">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Open Popover</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="space-y-2">
                      <h4 className="font-medium">Popover Title</h4>
                      <p className="text-sm text-muted-foreground">
                        This is popover content. You can place any elements here.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </ComponentCard>
            </div>
          </Section>

          {/* Navigation Section */}
          <Section id="navigation" title="Navigation" description="Navigation components for guiding users.">
            <div className="grid gap-6 md:grid-cols-2">
              <ComponentCard title="Tabs">
                <Tabs defaultValue="account">
                  <TabsList>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="account" className="mt-4">
                    <p className="text-sm text-muted-foreground">Account settings and preferences.</p>
                  </TabsContent>
                  <TabsContent value="password" className="mt-4">
                    <p className="text-sm text-muted-foreground">Change your password here.</p>
                  </TabsContent>
                  <TabsContent value="settings" className="mt-4">
                    <p className="text-sm text-muted-foreground">Advanced settings and configuration.</p>
                  </TabsContent>
                </Tabs>
              </ComponentCard>

              <ComponentCard title="Accordion">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is this?</AccordionTrigger>
                    <AccordionContent>
                      This is an accordion component for expandable content sections.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How does it work?</AccordionTrigger>
                    <AccordionContent>
                      Click on the header to expand or collapse the content panel.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Can I customize it?</AccordionTrigger>
                    <AccordionContent>
                      Yes, you can customize the styling and behavior to fit your needs.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </ComponentCard>
            </div>
          </Section>

          {/* Layout Section */}
          <Section id="layout" title="Layout" description="Cards and layout components.">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card description goes here</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This is the main content area of the card component.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">John Doe</CardTitle>
                      <CardDescription>Software Engineer</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Building great products with modern technologies.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Profile</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Users</span>
                    <Badge>2,543</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active</span>
                    <Badge variant="secondary">1,832</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Revenue</span>
                    <Badge variant="outline">$12.5k</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="mt-24 text-center text-sm text-muted-foreground">
          <p>Built with shadcn/ui components. Toggle dark mode with the button in the top right.</p>
        </div>
      </div>
    </div>
  );
}
