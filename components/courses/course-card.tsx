import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Clock, Users, BarChart, Star } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  featuredImage: string;
  price: number;
  salePrice?: number;
  isFree: boolean;
  duration: string;
  level: string;
  totalLessons: number;
  category: {
    name: string;
    slug: string;
  };
}

export function CourseCard({
  id,
  title,
  slug,
  subtitle,
  featuredImage,
  price,
  salePrice,
  isFree,
  duration,
  level,
  totalLessons,
  category,
}: CourseCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Link href={`/courses/${slug}`} className="block">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={featuredImage || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {isFree ? (
            <Badge className="absolute right-2 top-2 bg-green-500 hover:bg-green-600">
              Free
            </Badge>
          ) : salePrice ? (
            <Badge className="absolute right-2 top-2 bg-orange-500 hover:bg-orange-600">
              Sale
            </Badge>
          ) : null}
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-normal">
            {category.name}
          </Badge>
          <Badge variant="outline" className="text-xs font-normal capitalize">
            {level.replace("-", " ")}
          </Badge>
        </div>

        <Link href={`/courses/${slug}`} className="block">
          <h3 className="mb-1 line-clamp-2 text-xl font-bold transition-colors hover:text-primary">
            {title}
          </h3>
        </Link>

        {subtitle && (
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            <span>{level.replace("-", " ")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{totalLessons} lessons</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t bg-muted/30 p-4">
        <div className="flex w-full items-center justify-between">
          <div>
            {isFree ? (
              <span className="text-lg font-bold text-green-600">Free</span>
            ) : (
              <div className="flex items-center gap-2">
                {salePrice ? (
                  <>
                    <span className="text-lg font-bold">${salePrice}</span>
                    <span className="text-sm text-muted-foreground line-through">
                      ${price}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold">${price}</span>
                )}
              </div>
            )}
          </div>
          <Link
            href={`/courses/${slug}`}
            className="rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            View Course
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
