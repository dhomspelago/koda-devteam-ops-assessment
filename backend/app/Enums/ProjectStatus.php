<?php

declare(strict_types=1);

namespace App\Enums;

enum ProjectStatus: string
{
    case Planning = 'Planning';
    case InProgress = 'In Progress';
    case OnHold = 'On Hold';
    case Completed = 'Completed';
}
