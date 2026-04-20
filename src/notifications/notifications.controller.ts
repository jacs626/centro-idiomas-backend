import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

interface RequestWithUser extends Request {
  user: { sub: number; role: string; email: string };
}

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get('my')
  getMyNotifications(@Req() req: RequestWithUser) {
    return this.service.getNotifications(req.user.sub, req.user.role);
  }

  @Get('badge')
  getBadgeCount(@Req() req: RequestWithUser) {
    return this.service.getBadgeCount(req.user.sub, req.user.role);
  }
}
