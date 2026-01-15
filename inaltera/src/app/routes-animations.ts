import { trigger, transition, style, animate} from '@angular/animations';

export const routeAnimations =
    trigger('routerAnimations', [
        transition('* => *', [
            style({
                opacity:0,
                transform: 'translateY(20px)'
            }),
            animate('300ms ease-out', style({
                opacity:1,
                transform:'translateY(0)'
            }))
        ])
    ]);