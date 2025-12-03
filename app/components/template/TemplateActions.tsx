'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Download } from 'lucide-react';
import { BuyTemplate } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface TemplateActionsProps {
  template: {
    id: string;
    price: number;
    likeCount: number;
  };
  isLiked?: boolean;
  canDownload?: boolean;
}

export function TemplateActions({ template, isLiked = false, canDownload = false }: TemplateActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    if (template.price === 0) {
      // Handle free template
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('templateId', template.id);
        // await claimFreeTemplate(formData);
        toast.success('Template claimed successfully!');
        router.push(`/download/${template.id}`);
      } catch (error) {
        toast.error('Failed to claim template');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('id', template.id);
        await BuyTemplate(formData);
      } catch (error) {
        toast.error('Failed to initiate purchase');
        setLoading(false);
      }
    }
  };

  const handleLike = async () => {
    // TODO: Implement like functionality
    toast.info('Like functionality coming soon');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Button
          onClick={handleBuy}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {template.price === 0 ? (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download Free
            </>
          ) : (
            `Buy for ${(template.price / 100).toFixed(2)}`
          )}
        </Button>
        {canDownload && (
          <Button variant="outline" className="w-full" onClick={() => router.push(`/download/${template.id}`)}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        )}
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleLike}
      >
        <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        {isLiked ? 'Liked' : 'Add to Favorites'} ({template.likeCount})
      </Button>
    </div>
  );
}
