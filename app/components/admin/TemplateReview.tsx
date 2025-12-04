import { TemplateHeader } from '@/app/components/template/TemplateHeader';
import { TemplatePreview } from '@/app/components/template/TemplatePreview';
import { TemplateGallery } from '@/app/components/template/TemplateGallery';
import { TemplateDetails } from '@/app/components/template/TemplateDetails';
import { CreatorInfo } from '@/app/components/template/CreatorInfo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TemplateReviewProps {
  template: any;
}

export function TemplateReview({ template }: TemplateReviewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Template Information</CardTitle>
            <Badge>{template.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <TemplateHeader template={template} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <TemplatePreview template={template} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <TemplateGallery template={template} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TemplateDetails template={template} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Creator Information</CardTitle>
        </CardHeader>
        <CardContent>
          <CreatorInfo creator={template.creator} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Views</p>
              <p className="text-2xl font-bold">{template.viewCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sales</p>
              <p className="text-2xl font-bold">{template._count.orders}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Favorites</p>
              <p className="text-2xl font-bold">{template._count.favorites}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
