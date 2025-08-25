import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Users, Play, DollarSign, Award, Plus, Edit, BarChart3, Eye } from 'lucide-react';
import type { Content, Ad } from '@shared/schema';

export default function AdminPage() {
  const { appUser, isAuthenticated, loading } = useAuth();

  const { data: content = [] } = useQuery<Content[]>({
    queryKey: ['/api/admin/content'],
    enabled: !!appUser && appUser.role === 'ADMIN',
  });

  const { data: ads = [] } = useQuery<Ad[]>({
    queryKey: ['/api/admin/ads'],
    enabled: !!appUser && appUser.role === 'ADMIN',
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-gold-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !appUser || appUser.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-dark-900 text-white">
        <NavBar />
        <div className="pt-16 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-400">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge className={isActive ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}>
        {isActive ? 'ACTIVE' : 'INACTIVE'}
      </Badge>
    );
  };

  const getAdStatusBadge = (active: boolean) => {
    return (
      <Badge className={active ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}>
        {active ? 'ACTIVE' : 'PAUSED'}
      </Badge>
    );
  };

  // Mock stats - in real implementation, these would come from API
  const stats = {
    totalUsers: 12847,
    activeCourses: content.filter(c => c.isActive).length,
    totalRevenue: 243580,
    certificatesIssued: 1847,
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <NavBar />
      
      <main className="pt-16">
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-playfair font-bold mb-4">
              Admin <span className="text-gold-400">Dashboard</span>
            </h1>
            <p className="text-gray-300">Content and platform management</p>
          </div>

          {/* Admin Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-dark-800 border-dark-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-sm font-semibold text-gray-300">Total Users</CardTitle>
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-blue-400">{stats.totalUsers.toLocaleString()}</div>
                <div className="text-sm text-green-400 mt-2">+8.3% this month</div>
              </CardContent>
            </Card>

            <Card className="bg-dark-800 border-dark-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-sm font-semibold text-gray-300">Active Courses</CardTitle>
                  <Play className="w-6 h-6 text-gold-400" />
                </div>
                <div className="text-3xl font-bold text-gold-400">{stats.activeCourses}</div>
                <div className="text-sm text-green-400 mt-2">+3 this week</div>
              </CardContent>
            </Card>

            <Card className="bg-dark-800 border-dark-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-sm font-semibold text-gray-300">Revenue</CardTitle>
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-green-400">₹{stats.totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-green-400 mt-2">+12.5% this month</div>
              </CardContent>
            </Card>

            <Card className="bg-dark-800 border-dark-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-sm font-semibold text-gray-300">Certificates Issued</CardTitle>
                  <Award className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-purple-400">{stats.certificatesIssued.toLocaleString()}</div>
                <div className="text-sm text-green-400 mt-2">+15.2% this month</div>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="content" className="space-y-6">
            <TabsList className="bg-dark-800 border-dark-600">
              <TabsTrigger value="content" className="data-[state=active]:bg-gold-400 data-[state=active]:text-black">
                Content Management
              </TabsTrigger>
              <TabsTrigger value="ads" className="data-[state=active]:bg-gold-400 data-[state=active]:text-black">
                Ad Management
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-gold-400 data-[state=active]:text-black">
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Content Management */}
            <TabsContent value="content">
              <Card className="bg-dark-800 border-dark-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold">Content Management</CardTitle>
                    <Button className="bg-gold-400 text-black hover:bg-gold-300" data-testid="add-course-button">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Course
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {content.length > 0 ? (
                    <div className="divide-y divide-dark-600">
                      {content.map((item) => (
                        <div key={item.id} className="py-4 flex items-center justify-between" data-testid={`content-item-${item.id}`}>
                          <div className="flex items-center space-x-3">
                            <img 
                              src={item.thumbnailUrl} 
                              alt={item.title} 
                              className="w-16 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <h4 className="font-semibold text-lg">{item.title}</h4>
                              <p className="text-sm text-gray-400">
                                {item.category} • {item.viewCount?.toLocaleString() || 0} views
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getStatusBadge(item.isActive)}
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <BarChart3 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Play className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No content found</h3>
                      <p className="text-gray-400">Start by adding your first course</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Ad Management */}
            <TabsContent value="ads">
              <Card className="bg-dark-800 border-dark-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold">Ad Management</CardTitle>
                    <Button className="bg-gold-400 text-black hover:bg-gold-300" data-testid="add-ad-button">
                      <Plus className="w-4 h-4 mr-2" />
                      New Ad
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {ads.length > 0 ? (
                    <div className="divide-y divide-dark-600">
                      {ads.map((ad) => (
                        <div key={ad.id} className="py-4 flex items-center justify-between" data-testid={`ad-item-${ad.id}`}>
                          <div className="flex items-center space-x-3">
                            <img 
                              src={ad.imageUrl} 
                              alt={ad.title} 
                              className="w-16 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <h4 className="font-semibold text-lg">{ad.title}</h4>
                              <p className="text-sm text-gray-400">
                                {ad.placement} • {ad.clickCount} clicks
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getAdStatusBadge(ad.active)}
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <BarChart3 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BarChart3 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No ads configured</h3>
                      <p className="text-gray-400">Create your first ad campaign</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics">
              <Card className="bg-dark-800 border-dark-600">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Analytics Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                    <p className="text-gray-400">Detailed analytics and reporting features coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}
