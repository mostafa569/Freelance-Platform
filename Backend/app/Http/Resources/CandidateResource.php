<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CandidateResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->full_name,
            'email' => $this->email,
            "phone" => $this->phone,
            "resume" => $this->resume_url,
            "experience" => $this->experience_level,
            "location" => $this->location,
            "created_at" => $this->created_at,
        ];
    }
}
