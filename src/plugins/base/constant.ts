/**
 * JS 插件
 */
export enum JSPlugin {
  Babel,
  Prettier,
  QCdn,
  devServer,
}

/**
 * TS 插件
 */
export enum TSPlugin {
  Prettier,
  QCdn,
  devServer,
}

/**
 * JSX 插件
 */
export enum JSXPlugin {
  Prettier,
  QCdn,
  devServer,
}

/**
 * TSX 插件
 */
export enum TSXPlugin {
  Prettier,
  QCdn,
  devServer,
}

/**
 * 视图框架插件
 */
export enum PREPlugin {
  Preact
}

/**
 * css预处理器
 */
export enum CSSPlugin {
  Sass = 'Sass',
  Less = 'Less',
  None = '不使用CSS预处理器',
}