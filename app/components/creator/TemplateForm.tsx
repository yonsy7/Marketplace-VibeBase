'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ImageUploader } from './ImageUploader';
import { StyleSelector } from '@/app/components/classification/StyleSelector';
import { CategorySelector } from '@/app/components/classification/CategorySelector';
import { SubcategorySelector } from '@/app/components/classification/SubcategorySelector';
import { TagInput } from '@/app/components/classification/TagInput';
import { TechStackSelector } from '@/app/components/classification/TechStackSelector';
import { PlatformSelector } from '@/app/components/classification/PlatformSelector';
import { FileUploadHTML } from './FileUploadHTML';
import { FileUploadZip } from './FileUploadZip';
import { Editor } from '@/app/components/Editor';
import { JSONContent } from '@tiptap/react';
import { Toggle } from '@/components/ui/toggle';
import { createTemplate, updateTemplate } from '@/app/actions';
import { toast } from 'sonner';
import { TechStack, PlatformType } from '@prisma/client';

interface TemplateFormProps {
  categories: Array<{
    id: string;
    name: string;
    description?: string;
    icon?: string;
    subcategories: Array<{
      id: string;
      name: string;
    }>;
  }>;
  styleTags: Array<{
    id: string;
    name: string;
  }>;
  tags: Array<{
    id: string;
    name: string;
  }>;
  initialData?: {
    title: string;
    byline: string;
    shortDesc: string;
    techStack: TechStack;
    price: number;
    isPaid: boolean;
    liveDemoUrl: string;
    images: string[];
    styles: string[];
    categoryIds: string[];
    subcategoryIds: string[];
    tagIds: string[];
    platforms: PlatformType[];
    files: Array<{ url: string; type: string; name: string; isPreview?: boolean }>;
    description: string;
  };
  templateId?: string;
  isEdit?: boolean;
}

export function TemplateForm({ categories, styleTags, tags, initialData, templateId, isEdit = false }: TemplateFormProps) {
  const router = useRouter();
  const [state, formAction] = useFormState(isEdit ? updateTemplate : createTemplate, null);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    byline: initialData?.byline || '',
    shortDesc: initialData?.shortDesc || '',
    techStack: (initialData?.techStack || '') as TechStack | '',
    price: initialData?.price || 0,
    isPaid: initialData?.isPaid || false,
    liveDemoUrl: initialData?.liveDemoUrl || '',
    images: initialData?.images || [],
    styles: initialData?.styles || [],
    categoryIds: initialData?.categoryIds || [],
    subcategoryIds: initialData?.subcategoryIds || [],
    tagIds: initialData?.tagIds || [],
    platforms: initialData?.platforms || [],
    files: initialData?.files || [],
    description: (initialData?.description || '') as string | JSONContent,
  });

  if (state?.status === 'success') {
    toast.success(isEdit ? 'Template updated successfully!' : 'Template created successfully!');
    router.push(`/creator/templates`);
  }

  if (state?.status === 'error') {
    toast.error(state.message || 'Failed to create template');
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataObj = new FormData();
    
    formDataObj.append('title', formData.title);
    formDataObj.append('byline', formData.byline);
    formDataObj.append('shortDesc', formData.shortDesc);
    formDataObj.append('techStack', formData.techStack);
    formDataObj.append('price', formData.isPaid ? (formData.price * 100).toString() : '0');
    formDataObj.append('liveDemoUrl', formData.liveDemoUrl);
    formDataObj.append('images', JSON.stringify(formData.images));
    formDataObj.append('styles', JSON.stringify(formData.styles));
    formDataObj.append('categoryIds', JSON.stringify(formData.categoryIds));
    formDataObj.append('subcategoryIds', JSON.stringify(formData.subcategoryIds));
    formDataObj.append('tagIds', JSON.stringify(formData.tagIds));
    formDataObj.append('platforms', JSON.stringify(formData.platforms));
    formDataObj.append('files', JSON.stringify(formData.files));
    formDataObj.append('description', formData.description);
    
    if (isEdit && templateId) {
      formDataObj.append('templateId', templateId);
    }

    formAction(formDataObj);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="visuals">Visuals</TabsTrigger>
          <TabsTrigger value="classification">Classification</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide the essential details about your template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Dark SaaS Landing Page"
                  maxLength={50}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {formData.title.length}/50 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="byline">Byline (Optional)</Label>
                <Input
                  id="byline"
                  value={formData.byline}
                  onChange={(e) => setFormData({ ...formData, byline: e.target.value })}
                  placeholder="e.g., Best Agency Template"
                  maxLength={80}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.byline.length}/80 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDesc">Short Description *</Label>
                <Textarea
                  id="shortDesc"
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  placeholder="Brief description (max 260 characters)"
                  maxLength={260}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {formData.shortDesc.length}/260 characters
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Tech Stack *</Label>
                <TechStackSelector
                  value={formData.techStack || undefined}
                  onChange={(value) => setFormData({ ...formData, techStack: value })}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Pricing</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Free</span>
                    <Toggle
                      pressed={formData.isPaid}
                      onPressedChange={(pressed) => setFormData({ ...formData, isPaid: pressed })}
                    >
                      Paid
                    </Toggle>
                  </div>
                </div>
                {formData.isPaid && (
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (USD)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visuals Tab */}
        <TabsContent value="visuals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visuals</CardTitle>
              <CardDescription>
                Add at least two images that showcase your template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader
                images={formData.images}
                onChange={(images) => setFormData({ ...formData, images })}
                maxImages={4}
                minImages={2}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Classification Tab */}
        <TabsContent value="classification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Classification</CardTitle>
              <CardDescription>
                Help users find your template by categorizing it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <StyleSelector
                selected={formData.styles}
                onChange={(styles) => setFormData({ ...formData, styles })}
              />

              <Separator />

              <CategorySelector
                selected={formData.categoryIds}
                onChange={(categoryIds) => setFormData({ ...formData, categoryIds })}
                categories={categories}
              />

              <Separator />

              <SubcategorySelector
                selected={formData.subcategoryIds}
                onChange={(subcategoryIds) => setFormData({ ...formData, subcategoryIds })}
                subcategories={categories.flatMap((c) =>
                  c.subcategories.map((s) => ({ ...s, categoryId: c.id }))
                )}
                selectedCategories={formData.categoryIds}
              />

              <Separator />

              <TagInput
                selected={formData.tagIds}
                onChange={(tagIds) => setFormData({ ...formData, tagIds })}
                suggestions={tags}
              />

              <Separator />

              <div className="space-y-4">
                <Label>Compatible AI Platforms</Label>
                <PlatformSelector
                  selected={formData.platforms}
                  onChange={(platforms) => setFormData({ ...formData, platforms })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value="files" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Files</CardTitle>
              <CardDescription>
                Upload your template files based on the tech stack
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.techStack === 'HTML' ? (
                <FileUploadHTML
                  files={formData.files}
                  onChange={(files) => setFormData({ ...formData, files })}
                />
              ) : (
                <>
                  <FileUploadZip
                    files={formData.files}
                    onChange={(files) => setFormData({ ...formData, files })}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="liveDemoUrl">Live Demo URL *</Label>
                    <Input
                      id="liveDemoUrl"
                      type="url"
                      value={formData.liveDemoUrl}
                      onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                      placeholder="https://your-demo.com"
                      required={formData.techStack !== 'HTML'}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Description Tab */}
        <TabsContent value="description" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Full Description</CardTitle>
              <CardDescription>
                Provide a detailed description of your template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Editor
                content={formData.description || ''}
                onChange={(json: JSONContent) => setFormData({ ...formData, description: JSON.stringify(json) })}
                editable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            // Save as draft
            const formDataObj = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
              if (Array.isArray(value)) {
                formDataObj.append(key, JSON.stringify(value));
              } else {
                formDataObj.append(key, value.toString());
              }
            });
            formDataObj.append('status', 'DRAFT');
            // TODO: Implement save as draft
          }}
        >
          Save as Draft
        </Button>
        <Button type="submit">
          {isEdit ? 'Update Template' : 'Submit for Review'}
        </Button>
      </div>
    </form>
  );
}
