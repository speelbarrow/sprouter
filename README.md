# 🌱 `spRouter` 🌱
Dead simple and fully configurable. The last `((Java|Type)Script)|(J|T)SX` router you'll ever need.

---

## Features

*This is a work in progress! Not yet ready to be used.*

- **Dead simple** - Sensible defaults are provided for drop-in installation. 
- [**Fully configurable**](#naked_opts) - All configuration options are exposed in some form or another.
- TypeScript/JSX support - Thanks to the Bun run-time's TypeScript and JSX support, 
  files can be transpiled on-the-fly by the router itself.

### `naked_opts`
> ' [*... but my soul must be iron ... 'cause my fear is naked ... I'm naked and fearless ... and my fear is NAKEDDDDD!*](https://youtu.be/O7VmBC19P5M?si=wpJbCramdZF_SePH&t=263) '

The `naked_opts` parameter of any `spRouter` function is an object that can be used to pass configuration directly 
to methods used by the router. The object uses function references converted to strings as keys and configuration 
object types to specify the values. See individual function documentation for more information.

## Thanks
HUGE THANKS to [the Bun project](https://bun.sh). This entire project is built upon specific features of Bun.

## License
This project is licensed under the GPLv3 license. See the [LICENSE](LICENSE) file for more info.
