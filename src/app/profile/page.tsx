'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToastContext } from '@/components/ui/ToastContext';
import { useForm } from '@/lib/hooks/use-form';
import { profileSchema, type ProfileFormData } from '@/lib/validations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Mail,
  Calendar,
  Shield,
  CreditCard,
  Activity,
  Settings,
  Bell,
  Key
} from 'lucide-react';
import { useAppSelector } from '@/store/store';
import { useUpdateProfileMutation } from '@/services/userService';


export default function ProfilePage() {
  const { success, error } = useToastContext();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const user = useAppSelector((state) => state.auth.user);
  let username = user?.username || '';
  let email = user?.email || '';
  let bio = user?.bio || '';
  let avatar = user?.avatar || '';
  let firstName = user?.firstName || '';
  let lastName = user?.lastName || '';

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();


  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, reset } = useForm<ProfileFormData>({

    initialValues: {
      name: username || '',
      email: email,
      username: username,
      firstName: firstName,
      lastName: lastName,
      bio: bio,
      avatar: avatar
    },
    enableReinitialize: true,
    validationSchema: profileSchema,
    onSubmit: async (data) => {

      try {
        const { success: apiStatus, result, message } = await updateProfile(data).unwrap();
        if (apiStatus) {
          success('Profile updated successfully');
        }
        if (message) {
          success(`${message}`);
        }
        setIsEditing(false);
      } catch (err) {
        error('Failed to update profile');
      }
    }

  });


  useEffect(() => {
    // Reset form when editing state changes
    if (user) {
      reset({
        name: user?.username || '',
        email: user?.email || '',
        username: user?.username || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        bio: user?.bio || '',
        avatar: user?.avatar || ''
      });
    }
  }, [user]);
  // Sample statistics data
  const stats = [
    { label: 'Total Trades', value: '1,234' },
    { label: 'Win Rate', value: '68%' },
    { label: 'Total Profit', value: '$12,345' },
    { label: 'Member Since', value: 'Jan 2023' },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={values.avatar} />
                  <AvatarFallback>{values.name[0]}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-semibold">{values.name}</h3>
                  <p className="text-sm text-muted-foreground">@{values.username}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-sm font-medium">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('security')}>
                <Shield className="mr-2 h-4 w-4" />
                Security
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('notifications')}>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('billing')}>
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('activity')}>
                <Activity className="mr-2 h-4 w-4" />
                Activity
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and how others see you on the platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="firstName"
                          value={values.firstName}
                          onChange={(e) => handleChange('firstName', e.target.value)}
                          onBlur={() => handleBlur('firstName')}
                        />
                      ) : (
                        <p className="text-lg">{values.firstName}</p>
                      )}
                      {touched.firstName && errors.firstName && (
                        <p className="text-sm text-red-500">{errors.firstName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      {isEditing ? (
                        <Input
                          id="username"
                          value={values.username}
                          onChange={(e) => handleChange('username', e.target.value)}
                          onBlur={() => handleBlur('username')}
                        />
                      ) : (
                        <p className="text-lg">@{values.username}</p>
                      )}
                      {touched.username && errors.username && (
                        <p className="text-sm text-red-500">{errors.username}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={values.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          onBlur={() => handleBlur('email')}
                        />
                      ) : (
                        <p className="text-lg">{values.email}</p>
                      )}
                      {touched.email && errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      {isEditing ? (
                        <Input
                          id="bio"
                          value={values.bio}
                          onChange={(e) => handleChange('bio', e.target.value)}
                          onBlur={() => handleBlur('bio')}
                        />
                      ) : (
                        <p className="text-lg">{values.bio}</p>
                      )}
                      {touched.bio && errors.bio && (
                        <p className="text-sm text-red-500">{errors.bio}</p>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trading Statistics</CardTitle>
                  <CardDescription>Your trading performance and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                      <div key={stat.label} className="p-4 border rounded-lg">
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security and authentication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Change Password</h4>
                        <p className="text-sm text-muted-foreground">
                          Update your password regularly to keep your account secure
                        </p>
                      </div>
                      <Button variant="outline">Change Password</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Configure how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Add notification settings here */}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>Manage your billing details and subscription</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Add billing information here */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 