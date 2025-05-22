'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/lib/hooks/use-toast';
import { useForm } from '@/lib/hooks/use-form';
import { settingsSchema, type SettingsFormData } from '@/lib/validations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Bell,
  Moon,
  Globe,
  Clock,
  Layout,
  Shield,
  Eye,
  Volume2,
  Mail,
  MessageSquare
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, TIMEZONES, TRADING_VIEWS } from '@/lib/constants';

export default function SettingsPage() {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState('general');

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm<SettingsFormData>({
    initialValues: {
      emailNotifications: true,
      tradingNotifications: true,
      twoFactorAuth: false,
      darkMode: false,
      language: 'en',
      timezone: 'UTC',
      tradingView: 'basic'
    },
    validationSchema: settingsSchema,
    onSubmit: async (data) => {
      try {
        // TODO: Implement API call
        console.log('Saving settings:', data);
        success('Settings updated successfully');
      } catch (err) {
        error('Failed to update settings');
      }
    },
  });

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant={activeTab === 'general' ? 'secondary' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('general')}
              >
                <Layout className="mr-2 h-4 w-4" />
                General
              </Button>
              <Button 
                variant={activeTab === 'notifications' ? 'secondary' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('notifications')}
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              <Button 
                variant={activeTab === 'appearance' ? 'secondary' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('appearance')}
              >
                <Eye className="mr-2 h-4 w-4" />
                Appearance
              </Button>
              <Button 
                variant={activeTab === 'security' ? 'secondary' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('security')}
              >
                <Shield className="mr-2 h-4 w-4" />
                Security
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Manage your general account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Language</Label>
                        <p className="text-sm text-muted-foreground">
                          Select your preferred language
                        </p>
                      </div>
                      <Select
                        value={values.language}
                        onValueChange={(value) => handleChange('language', value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SUPPORTED_LANGUAGES.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Timezone</Label>
                        <p className="text-sm text-muted-foreground">
                          Set your local timezone
                        </p>
                      </div>
                      <Select
                        value={values.timezone}
                        onValueChange={(value) => handleChange('timezone', value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIMEZONES.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Trading View</Label>
                        <p className="text-sm text-muted-foreground">
                          Choose your preferred trading interface
                        </p>
                      </div>
                      <Select
                        value={values.tradingView}
                        onValueChange={(value) => handleChange('tradingView', value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TRADING_VIEWS.map((view) => (
                            <SelectItem key={view.value} value={view.value}>
                              {view.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        checked={values.emailNotifications}
                        onCheckedChange={(checked) => handleChange('emailNotifications', checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Trading Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about your trading activities
                        </p>
                      </div>
                      <Switch
                        checked={values.tradingNotifications}
                        onCheckedChange={(checked) => handleChange('tradingNotifications', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>Customize how the application looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Switch between light and dark themes
                        </p>
                      </div>
                      <Switch
                        checked={values.darkMode}
                        onCheckedChange={(checked) => handleChange('darkMode', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch
                        checked={values.twoFactorAuth}
                        onCheckedChange={(checked) => handleChange('twoFactorAuth', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 