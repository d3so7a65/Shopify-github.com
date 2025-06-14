<?php

function redirect(strig $path)
{
    header(header: "Location: $path");
}