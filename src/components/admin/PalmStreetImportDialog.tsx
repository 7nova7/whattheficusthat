import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { palmstreetApi, PalmStreetProduct } from '@/lib/api/palmstreet';
import { Loader2, CheckCircle2, XCircle, Download } from 'lucide-react';

interface ImportResult {
  url: string;
  success: boolean;
  product?: PalmStreetProduct;
  error?: string;
}

interface PalmStreetImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function PalmStreetImportDialog({
  open,
  onOpenChange,
  onSuccess,
}: PalmStreetImportDialogProps) {
  const [urls, setUrls] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalUrls, setTotalUrls] = useState(0);
  const [results, setResults] = useState<ImportResult[]>([]);

  const parseUrls = (text: string): string[] => {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && line.includes('palmstreet.app'));
  };

  const handleImport = async () => {
    const urlList = parseUrls(urls);

    if (urlList.length === 0) {
      toast({
        title: 'No valid URLs',
        description: 'Please paste at least one PalmStreet URL',
        variant: 'destructive',
      });
      return;
    }

    setIsImporting(true);
    setResults([]);
    setTotalUrls(urlList.length);
    setCurrentIndex(0);
    setProgress(0);

    const importResults: ImportResult[] = [];

    for (let i = 0; i < urlList.length; i++) {
      const url = urlList[i];
      setCurrentIndex(i + 1);
      setProgress(((i + 1) / urlList.length) * 100);

      // Scrape the URL
      const scrapeResult = await palmstreetApi.scrapeUrl(url);

      if (!scrapeResult.success || !scrapeResult.data) {
        importResults.push({
          url,
          success: false,
          error: scrapeResult.error || 'Failed to scrape page',
        });
        continue;
      }

      // Import the product
      const importResult = await palmstreetApi.importProduct(scrapeResult.data);

      importResults.push({
        url,
        success: importResult.success,
        product: scrapeResult.data,
        error: importResult.error,
      });
    }

    setResults(importResults);
    setIsImporting(false);

    const successCount = importResults.filter((r) => r.success).length;
    const failCount = importResults.length - successCount;

    if (successCount > 0) {
      toast({
        title: 'Import Complete',
        description: `Successfully imported ${successCount} product${successCount !== 1 ? 's' : ''}${failCount > 0 ? `. ${failCount} failed.` : ''}`,
      });
      onSuccess();
    } else {
      toast({
        title: 'Import Failed',
        description: 'No products were imported. Check the URLs and try again.',
        variant: 'destructive',
      });
    }
  };

  const handleClose = (newOpen: boolean) => {
    if (!isImporting) {
      setUrls('');
      setResults([]);
      setProgress(0);
      onOpenChange(newOpen);
    }
  };

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.length - successCount;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Import from PalmStreet
          </DialogTitle>
          <DialogDescription>
            Paste PalmStreet product URLs (one per line) to import them into your
            inventory.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="urls">Product URLs</Label>
            <Textarea
              id="urls"
              placeholder={`https://palmstreet.app/product/...\nhttps://palmstreet.app/product/...\nhttps://palmstreet.app/product/...`}
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              disabled={isImporting}
              className="min-h-[150px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              {parseUrls(urls).length} valid URL{parseUrls(urls).length !== 1 ? 's' : ''} detected
            </p>
          </div>

          {isImporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Processing {currentIndex} of {totalUrls}...
                </span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {results.length > 0 && !isImporting && (
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm">
                {successCount > 0 && (
                  <span className="flex items-center gap-1 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    {successCount} imported
                  </span>
                )}
                {failCount > 0 && (
                  <span className="flex items-center gap-1 text-destructive">
                    <XCircle className="h-4 w-4" />
                    {failCount} failed
                  </span>
                )}
              </div>

              <div className="max-h-[150px] overflow-y-auto rounded-md border bg-muted/50 p-2 space-y-1">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-xs"
                  >
                    {result.success ? (
                      <CheckCircle2 className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="h-3 w-3 text-destructive mt-0.5 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {result.product?.name || 'Unknown'}
                      </p>
                      {result.error && (
                        <p className="text-destructive">{result.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isImporting}
          >
            {results.length > 0 ? 'Close' : 'Cancel'}
          </Button>
          {results.length === 0 && (
            <Button onClick={handleImport} disabled={isImporting || parseUrls(urls).length === 0}>
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                'Import All'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
