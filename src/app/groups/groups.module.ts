import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { GroupsRoutingModule } from './groups-routing.module';
import { GroupsComponent } from './groups.component';

@NgModule({
	declarations: [GroupsComponent],
	imports: [CommonModule, SharedModule, GroupsRoutingModule]
})
export class GroupsModule {}
