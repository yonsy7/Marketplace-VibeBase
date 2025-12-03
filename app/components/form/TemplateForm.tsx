"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UploadDropzone } from "@/app/lib/uploadthing";
import { TipTapEditor } from "../Editor";
import { Submitbutton } from "../SubmitButtons";
import { CreateTemplate, type State } from "@/app/actions";
import { 
  TECH_STACKS, 
  techStackLabels, 
  PLATFORMS, 
  platformLabels,
  TechStackType,
  Platform 
} from "@/app/lib/classification";
import { X, Upload, FileCode, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface StyleTag {
  id: string;
  name: string;
  slug: string;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  subcategories: Subcategory[];
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface TemplateFormProps {
  styles: StyleTag[];
  categories: Category[];
  tags: Tag[];
  mode: "create" | "edit";
  initialData?: {
    id?: string;
    title?: string;
    byline?: string;
    shortDesc?: string;
    longDesc?: string;
    price?: number;
    techStack?: TechStackType;
    liveDemoUrl?: string;
    previewImages?: string[];
    productFile?: string;
    selectedStyles?: string[];
    selectedCategories?: string[];
    selectedSubcategories?: string[];
    selectedTags?: string[];
    selectedPlatforms?: Platform[];
  };
}

export function TemplateForm({
  styles,
  categories,
  tags,
  mode,
  initialData,
}: TemplateFormProps) {
  const initialState: State = { message: "", status: undefined };
  const [state, formAction] = useFormState(CreateTemplate, initialState);

  // Form state
  const [selectedStyles, setSelectedStyles] = useState<string[]>(
    initialData?.selectedStyles || []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.selectedCategories || []
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    initialData?.selectedSubcategories || []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialData?.selectedTags || []
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    initialData?.selectedPlatforms || []
  );
  const [techStack, setTechStack] = useState<TechStackType>(
    initialData?.techStack || "HTML"
  );
  const [images, setImages] = useState<string[]>(
    initialData?.previewImages || []
  );
  const [productFile, setProductFile] = useState<string>(
    initialData?.productFile || ""
  );
  const [description, setDescription] = useState<string>(
    initialData?.longDesc || ""
  );
  const [isPaid, setIsPaid] = useState(
    initialData?.price ? initialData.price > 0 : false
  );

  // Get available subcategories based on selected categories
  const availableSubcategories = categories
    .filter((c) => selectedCategories.includes(c.id))
    .flatMap((c) => c.subcategories);

  useEffect(() => {
    if (state?.status === "error") {
      toast.error(state.message);
    } else if (state?.status === "success") {
      toast.success(state.message);
    }
  }, [state]);

  const toggleStyle = (styleId: string) => {
    if (selectedStyles.includes(styleId)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== styleId));
    } else if (selectedStyles.length < 5) {
      setSelectedStyles([...selectedStyles, styleId]);
    } else {
      toast.error("Maximum 5 styles allowed");
    }
  };

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== categoryId));
      // Remove subcategories of this category
      const categorySubIds = categories
        .find((c) => c.id === categoryId)
        ?.subcategories.map((s) => s.id) || [];
      setSelectedSubcategories(
        selectedSubcategories.filter((s) => !categorySubIds.includes(s))
      );
    } else if (selectedCategories.length < 3) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      toast.error("Maximum 3 categories allowed");
    }
  };

  const toggleSubcategory = (subcategoryId: string) => {
    if (selectedSubcategories.includes(subcategoryId)) {
      setSelectedSubcategories(
        selectedSubcategories.filter((s) => s !== subcategoryId)
      );
    } else if (selectedSubcategories.length < 6) {
      setSelectedSubcategories([...selectedSubcategories, subcategoryId]);
    } else {
      toast.error("Maximum 6 subcategories allowed");
    }
  };

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <form action={formAction} className="space-y-8">
      {/* Hidden fields */}
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="productFile" value={productFile} />
      <input type="hidden" name="description" value={description} />
      <input type="hidden" name="techStack" value={techStack} />
      <input type="hidden" name="styles" value={JSON.stringify(selectedStyles)} />
      <input type="hidden" name="categories" value={JSON.stringify(selectedCategories)} />
      <input type="hidden" name="subcategories" value={JSON.stringify(selectedSubcategories)} />
      <input type="hidden" name="tags" value={JSON.stringify(selectedTags)} />
      <input type="hidden" name="platforms" value={JSON.stringify(selectedPlatforms)} />

      {/* Visuals Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Visuals
          </CardTitle>
          <CardDescription>
            Add 2-4 images that showcase your template (first image will be the cover)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative group aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={image}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {index === 0 && (
                    <Badge className="absolute bottom-2 left-2">Cover</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {images.length < 4 && (
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                const newImages = res.map((r) => r.url);
                setImages([...images, ...newImages].slice(0, 4));
                toast.success("Images uploaded successfully");
              }}
              onUploadError={(error: Error) => {
                toast.error(`Upload failed: ${error.message}`);
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Basic Info Section */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Template Name *</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Dark SaaS Landing Page"
              maxLength={50}
              defaultValue={initialData?.title}
              required
            />
            <p className="text-xs text-muted-foreground">Max 50 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="byline">Byline (optional)</Label>
            <Input
              id="byline"
              name="byline"
              placeholder="e.g., Best Agency Template for 2024"
              maxLength={80}
              defaultValue={initialData?.byline}
            />
            <p className="text-xs text-muted-foreground">Max 80 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDesc">Short Description *</Label>
            <Textarea
              id="shortDesc"
              name="shortDesc"
              placeholder="A brief summary of your template..."
              maxLength={260}
              defaultValue={initialData?.shortDesc}
              required
            />
            <p className="text-xs text-muted-foreground">Max 260 characters</p>
          </div>
        </CardContent>
      </Card>

      {/* Classification Section */}
      <Card>
        <CardHeader>
          <CardTitle>Classification</CardTitle>
          <CardDescription>
            Help buyers find your template with the right tags
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Styles */}
          <div className="space-y-2">
            <Label>Styles ({selectedStyles.length}/5)</Label>
            <div className="flex flex-wrap gap-2">
              {styles.map((style) => (
                <Badge
                  key={style.id}
                  variant={selectedStyles.includes(style.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleStyle(style.id)}
                >
                  {style.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Label>Categories ({selectedCategories.length}/3)</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Subcategories */}
          {availableSubcategories.length > 0 && (
            <div className="space-y-2">
              <Label>Subcategories ({selectedSubcategories.length}/6)</Label>
              <div className="flex flex-wrap gap-2">
                {availableSubcategories.map((subcategory) => (
                  <Badge
                    key={subcategory.id}
                    variant={selectedSubcategories.includes(subcategory.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleSubcategory(subcategory.id)}
                  >
                    {subcategory.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tech & Platforms Section */}
      <Card>
        <CardHeader>
          <CardTitle>Technology & Platforms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tech Stack */}
          <div className="space-y-2">
            <Label>Tech Stack *</Label>
            <RadioGroup
              value={techStack}
              onValueChange={(value) => setTechStack(value as TechStackType)}
              className="flex flex-wrap gap-4"
            >
              {TECH_STACKS.map((stack) => (
                <div key={stack} className="flex items-center space-x-2">
                  <RadioGroupItem value={stack} id={stack} />
                  <Label htmlFor={stack} className="cursor-pointer">
                    {techStackLabels[stack]}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* AI Platforms */}
          <div className="space-y-2">
            <Label>Compatible AI Platforms</Label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((platform) => (
                <Badge
                  key={platform}
                  variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => togglePlatform(platform)}
                >
                  {platformLabels[platform]}
                </Badge>
              ))}
            </div>
          </div>

          {/* Live Demo URL */}
          {(techStack === "REACT_VITE" || techStack === "NEXTJS") && (
            <div className="space-y-2">
              <Label htmlFor="liveDemoUrl">Live Demo URL *</Label>
              <Input
                id="liveDemoUrl"
                name="liveDemoUrl"
                type="url"
                placeholder="https://demo.example.com"
                defaultValue={initialData?.liveDemoUrl}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Files Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="h-5 w-5" />
            Template Files
          </CardTitle>
          <CardDescription>
            {techStack === "HTML"
              ? "Upload your HTML, CSS, JS files and assets"
              : "Upload a ZIP file containing your project"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {productFile ? (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <FileCode className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium">File uploaded</p>
                <p className="text-sm text-muted-foreground truncate max-w-md">
                  {productFile}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setProductFile("")}
              >
                Remove
              </Button>
            </div>
          ) : (
            <UploadDropzone
              endpoint="productFileUpload"
              onClientUploadComplete={(res) => {
                setProductFile(res[0].url);
                toast.success("File uploaded successfully");
              }}
              onUploadError={(error: Error) => {
                toast.error(`Upload failed: ${error.message}`);
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Pricing Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPaid"
              checked={isPaid}
              onCheckedChange={(checked) => setIsPaid(checked === true)}
            />
            <Label htmlFor="isPaid">This is a paid template</Label>
          </div>

          {isPaid && (
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="29.00"
                  className="pl-8"
                  defaultValue={
                    initialData?.price ? (initialData.price / 100).toFixed(2) : ""
                  }
                />
              </div>
              <p className="text-xs text-muted-foreground">
                You will receive 90% of the sale price
              </p>
            </div>
          )}

          {!isPaid && <input type="hidden" name="price" value="0" />}
        </CardContent>
      </Card>

      {/* Full Description Section */}
      <Card>
        <CardHeader>
          <CardTitle>Full Description</CardTitle>
          <CardDescription>
            Provide a detailed description of your template
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TipTapEditor json={description} setJson={setDescription} />
        </CardContent>
      </Card>

      {/* Submit Section */}
      <div className="flex items-center justify-end gap-4">
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <Submitbutton title="Submit for Review" />
      </div>
    </form>
  );
}
